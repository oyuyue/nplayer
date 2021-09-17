import {
  VideoSample, VideoTrack, AudioSample, AudioTrack,
} from '../domain';
import { AVC, AAC } from '../codec';
import { ExpGolomb } from '../helper';
import { concatUint8Array } from '../../utils';

const TS_SECOND = 90000;

export class TsDemuxer {
  private pmtId = -1;

  private remainingPacketData?: Uint8Array;

  private videoPesData: Uint8Array[] = [];

  private audioPesData: Uint8Array[] = [];

  private nextVideoDts?: number;

  private nextExpectVideoDts?: number;

  private nextAudioPts?: number;

  private nextExpectAudioPts?: number;

  private refDts?: number;

  readonly videoTrack;

  readonly audioTrack;

  constructor(videoTrack?: VideoTrack, audioTrack?: AudioTrack) {
    this.videoTrack = videoTrack || new VideoTrack();
    this.audioTrack = audioTrack || new AudioTrack();
  }

  demux(
    data: Uint8Array,
    startTime: number,
    contiguous = true,
    discontinuity: boolean,
  ) {
    if (!contiguous) {
      this.remainingPacketData = undefined;
      this.videoPesData = [];
      this.audioPesData = [];
    }

    if (discontinuity) {
      this.videoTrack.reset();
      this.audioTrack.reset();
    }

    if (this.remainingPacketData) {
      data = concatUint8Array(this.remainingPacketData, data);
      this.remainingPacketData = undefined;
    }

    let dataLen = data.length;
    const remainingLength = dataLen % 188;
    if (remainingLength) {
      this.remainingPacketData = data.subarray(dataLen - remainingLength);
      dataLen -= remainingLength;
    }

    let videoPid = this.videoTrack.pid;
    let audioPid = this.audioTrack.pid;

    for (let start = 0, len = data.length; start < len; start += 188) {
      if (data[start] !== 0x47) throw new Error('TS packet did not start with 0x47');
      const payloadUnitStartIndicator = !!(data[start + 1] & 0x40);
      const pid = ((data[start + 1] & 0x1f) << 8) + data[start + 2];
      const adaptationFiledControl = (data[start + 3] & 0x30) >> 4;

      let offset: number;
      if (adaptationFiledControl > 1) {
        offset = start + 5 + data[start + 4];
        if (offset === start + 188) continue;
      } else {
        offset = start + 4;
      }

      switch (pid) {
        case 0:
          if (payloadUnitStartIndicator) offset += data[offset] + 1;
          this.pmtId = ((data[offset + 10] & 0x1f) << 8) | data[offset + 11];
          break;
        case this.pmtId: {
          if (payloadUnitStartIndicator) offset += data[offset] + 1;
          const tableEnd = offset + 3 + (((data[offset + 1] & 0x0f) << 8) | data[offset + 2]) - 4;
          const programInfoLength = ((data[offset + 10] & 0x0f) << 8) | data[offset + 11];
          offset += 12 + programInfoLength;

          while (offset < tableEnd) {
            const esPid = ((data[offset + 1] & 0x1f) << 8) | data[offset + 2];

            switch (data[offset]) {
              case 0x0f: // AAC
                this.audioTrack.pid = audioPid = esPid;
                break;
              case 0x1b: // AVC
                this.videoTrack.pid = videoPid = esPid;
                break;
              default:
                // TODO: waring
            }

            offset += (((data[offset + 3] & 0x0f) << 8) | data[offset + 4]) + 5;
          }
        }
          break;
        case videoPid:
          if (payloadUnitStartIndicator && this.videoPesData.length) {
            this.parseAvc();
          }
          this.videoPesData.push(data.subarray(offset, start + 188));
          break;
        case audioPid:
          if (payloadUnitStartIndicator && this.audioPesData.length) {
            this.parseAac();
          }
          this.audioPesData.push(data.subarray(offset, start + 188));
          break;
        default:
          // TODO: waring
      }
    }

    this.videoTrack.timescale = TS_SECOND;
    this.audioTrack.timescale = this.audioTrack.sampleRate || 0;

    this.fix(startTime, contiguous);

    return {
      videoTrack: this.videoTrack,
      audioTrack: this.audioTrack,
    };
  }

  static probe(data: Uint8Array) {
    if (!data.length) return false;
    return data[0] === 0x47 && data[188] === 0x47 && data[376] === 0x47;
  }

  private parseAvc() {
    if (!this.videoPesData.length) return;
    const pes = TsDemuxer.parsePES(concatUint8Array(...this.videoPesData));
    if (pes) {
      const units = AVC.parseAnnexBNALus(pes.data);
      if (units) {
        this.createVideoSample(units, pes.pts, pes.dts);
      } else {
        // TODO: waring
      }
      this.videoPesData = [];
    } else {
      // TODO: waring
    }
  }

  private parseAac() {
    if (!this.audioPesData.length) return;
    const pes = TsDemuxer.parsePES(concatUint8Array(...this.audioPesData));
    if (pes) {
      let pts = pes.pts;
      if (pts == null) {
        if (!this.audioTrack.samples.length || !this.audioTrack.sampleRate) return;
        pts = this.audioTrack.samples[this.audioTrack.samples.length - 1].pts!
              + AAC.getFrameDuration(this.audioTrack.sampleRate);
      }

      const ret = AAC.parseAdts(pes.data, pts);
      if (!ret) {
        // TODO: waring
        return;
      }

      this.audioTrack.codec = ret.codec;
      this.audioTrack.channelCount = ret.channelCount;
      this.audioTrack.objectType = ret.objectType;
      this.audioTrack.sampleRate = ret.sampleRate;
      this.audioTrack.samplingFrequencyIndex = ret.samplingFrequencyIndex;
      this.audioTrack.samples.push(...ret.frames.map((s) => new AudioSample(s.pts, s.data)));

      // TODO: ret.skip warning
      // TODO: remaining warning

      this.audioPesData = [];
    } else {
      // TODO: waring
    }
  }

  private createVideoSample(units: Uint8Array[], pts?: number, dts?: number) {
    if (!units.length) return;
    const track = this.videoTrack;
    let sample = new VideoSample(pts!, dts!);
    units.forEach((unit) => {
      const type = unit[0] & 0x1f;
      switch (type) {
        case 1: // NDR
          sample.frame = true;

          if (track.sps.length && unit.length > 4) {
            const eg = new ExpGolomb(unit);
            eg.readUByte();
            eg.readUEG();
            const sliceType = eg.readUEG();

            if (
              sliceType === 2
              || sliceType === 4
              || sliceType === 7
              || sliceType === 9
            ) {
              sample.key = true;
              sample.flag.dependsOn = 2;
              sample.flag.isNonSyncSample = 0;
            }
          }
          break;
        case 5: // IDR
          sample.key = sample.frame = true;
          sample.flag.dependsOn = 2;
          sample.flag.isNonSyncSample = 0;
          break;
        case 6: // SEI
          AVC.parseSEI(AVC.removeEPB(unit));
          break;
        case 7: // SPS
          if (!track.sps.length) {
            track.sps = [unit];
            const spsInfo = AVC.parseSPS(AVC.removeEPB(unit));
            const codecs = unit.subarray(1, 4);
            let codec = 'avc1.';
            for (let i = 0; i < 3; i++) {
              let h = codecs[i].toString(16);
              if (h.length < 2) h = `0${h}`;
              codec += h;
            }
            track.codec = codec;
            track.width = spsInfo.width;
            track.height = spsInfo.height;
            track.sarRatio = spsInfo.sarRatio;
            track.profileIdc = spsInfo.profileIdc;
            track.profileCompatibility = spsInfo.profileCompatibility;
            track.levelIdc = spsInfo.levelIdc;
          }
          break;
        case 8: // PPS
          if (!track.pps.length) track.pps = [unit];
          break;
        case 9: // AUD

          if (sample.units.length) {
            if (!this.pushVideoSample(sample)) {
              // TODO: warning
            }
            sample = new VideoSample(pts!, dts!);
          }

          break;
      }
      sample.units.push(unit);
    });

    if (sample.units.length) {
      if (!this.pushVideoSample(sample)) {
        // TODO: warning
      }
    }
  }

  private pushVideoSample(sample: VideoSample) {
    if (sample && sample.units.length && sample.frame) {
      const track = this.videoTrack;
      if (sample.pts == null) {
        const lastSample = track.samples[track.samples.length - 1];
        if (lastSample) {
          sample.pts = lastSample.pts;
          sample.dts = lastSample.dts;
        } else {
          // TODO: waring
          track.dropped++;
          return false;
        }
      }
      track.samples.push(sample);
      return true;
    }
    return false;
  }

  private fix(startTime: number, contiguous: boolean) {
    const audioSamples = this.audioTrack.samples;
    const videoSamples = this.videoTrack.samples;

    const hasAudio = audioSamples.length > 1;
    const hasVideo = videoSamples.length > 1;

    if (!hasAudio && !hasVideo) return;

    if (!contiguous || !this.refDts) {
      this.refDts = videoSamples[0]?.dts || audioSamples[0]?.pts;
    }

    if (hasVideo && hasAudio) {
      if (!contiguous || this.nextVideoDts == null) {
        const firstAudioPts = TsDemuxer.normalizePts(audioSamples[0].pts, this.refDts);
        const firstVideoPts = TsDemuxer.normalizePts(videoSamples[0].pts, this.refDts);
        const firstVideoDts = TsDemuxer.normalizePts(videoSamples[0].dts, this.refDts);
        const audioSampleDuration = Math.round(1024 * TS_SECOND / this.audioTrack.timescale);
        let delta = firstVideoPts - firstAudioPts;

        if (delta < 0) {
          let frames = Math.floor(-delta / audioSampleDuration);
          frames++;
          // TODO: waring
          const frame = AAC.getSilentFrame(
            this.audioTrack.codec, this.audioTrack.channelCount,
          ) || audioSamples[0].data.subarray();
          let nextPts = firstAudioPts;
          while (frames--) {
            nextPts -= audioSampleDuration;
            audioSamples.unshift(new AudioSample(nextPts, frame, 1024));
          }
          delta = firstVideoPts - nextPts;
        } else {
          const dtsDelta = firstVideoDts - firstAudioPts;
          if (dtsDelta > 0) {
            let frames = Math.floor(dtsDelta / audioSampleDuration) + 1;
            delta -= frames * audioSampleDuration;
            // TODO: waring
            while (frames--) audioSamples.shift();
          }
        }

        if (delta) {
          // TODO: waring
          this.videoTrack.samples[0].pts = firstVideoDts + delta;
        }
      }

      const delta = this.fixVideo(startTime, contiguous);
      this.fixAudio(startTime, contiguous, delta);
    } else if (hasVideo) {
      this.fixVideo(startTime, contiguous);
    } else {
      this.fixAudio(startTime, contiguous);
    }

    if (hasVideo) {
      this.refDts = videoSamples[videoSamples.length - 1].dts;
    } else {
      this.refDts = audioSamples[audioSamples.length - 1].pts;
    }
  }

  private fixVideo(startTime: number, contiguous: boolean) {
    startTime *= TS_SECOND;
    const samples = this.videoTrack.samples;

    if (!contiguous || this.nextVideoDts == null) {
      this.nextVideoDts = Math.max(0, startTime - samples[0].cts);
      this.nextExpectVideoDts = 0;
    }

    let sortSamples = false;
    samples.forEach((sample, i) => {
      sample.pts = TsDemuxer.normalizePts(sample.pts, this.refDts);
      sample.dts = TsDemuxer.normalizePts(sample.dts, this.refDts);
      if (sample.dts > sample.pts) sample.dts = sample.pts;
      if (sample.dts < samples[i > 0 ? i - 1 : i].dts) {
        sortSamples = true;
      }
    });

    if (sortSamples) {
      // TODO: waring
      samples.sort((a, b) => a.dts - b.dts || a.pts - b.pts);
    }

    let delta = 0;
    if (this.nextExpectVideoDts) {
      delta = this.nextExpectVideoDts - samples[0].dts;
    }

    for (let i = 0, l = this.videoTrack.samples.length, curSample: VideoSample, nextSample: VideoSample; i < l; i++) {
      curSample = this.videoTrack.samples[i];
      nextSample = this.videoTrack.samples[i + 1];

      if (nextSample) {
        curSample.duration = nextSample.dts - curSample.dts;
      } else {
        curSample.duration = samples[i - 1].duration;
      }
    }

    this.videoTrack.baseMediaDecodeTime = this.nextVideoDts;
    const lastSample = samples[samples.length - 1];
    this.nextVideoDts += (lastSample.dts - samples[0].dts + lastSample.duration);
    this.nextExpectVideoDts = lastSample.dts + lastSample.duration;

    return delta;
  }

  private fixAudio(startTime: number, contiguous: boolean, videoDelta = 0) {
    startTime *= TS_SECOND;
    const track = this.audioTrack;
    const samples = track.samples;

    samples.forEach((sample) => {
      sample.pts = TsDemuxer.normalizePts(sample.pts, this.refDts);
    });

    if (!contiguous || this.nextAudioPts == null) {
      this.nextAudioPts = Math.max(startTime, 0);
      this.nextExpectAudioPts = 0;
    }

    const sampleDuration = 1024 * TS_SECOND / track.timescale;

    if (this.nextExpectAudioPts) {
      const delta = this.nextExpectAudioPts - samples[0].pts + videoDelta;
      let frames = Math.floor(Math.abs(delta) / sampleDuration);
      if (frames) {
        if (delta > 0) {
          // TODO: waring
          while (frames--) samples.shift();
        } else {
          // TODO: waring
          const frame = AAC.getSilentFrame(track.codec, track.channelCount) || samples[0].data.subarray();
          let nextPts = samples[0].pts;
          while (frames--) {
            nextPts -= sampleDuration;
            samples.unshift(new AudioSample(nextPts, frame, 1024));
          }
        }
      }
    }

    this.audioTrack.baseMediaDecodeTime = Math.round(this.nextAudioPts * track.timescale / TS_SECOND);

    const totalDuration = Math.round(samples.length * sampleDuration);
    this.nextAudioPts += totalDuration;
    this.nextExpectAudioPts = samples[0].pts + totalDuration;
  }

  private static normalizePts(value: number, reference?: number): number {
    let offset;
    if (reference == null) return value;

    if (reference < value) {
      offset = -8589934592; // - 2^33
    } else {
      offset = 8589934592; // + 2^33
    }

    while (Math.abs(value - reference) > 4294967296) {
      value += offset;
    }

    return value;
  }

  private static parsePES(data: Uint8Array): void | { data: Uint8Array, pts?: number, dts?: number } {
    const headerDataLen = data[8];
    if (headerDataLen == null || data.length < (headerDataLen + 9)) return;
    const startPrefix = data[0] << 16 | data[1] << 8 | data[2];
    if (startPrefix !== 1) return;
    const pesLen = (data[4] << 8) + data[5];
    if (pesLen && pesLen > data.length - 6) return;

    let pts;
    let dts;
    const ptsDtsFlags = data[7];
    if (ptsDtsFlags & 0xc0) {
      pts = (data[9] & 0x0e) * 536870912 // 1 << 29
        + (data[10] & 0xff) * 4194304 // 1 << 22
        + (data[11] & 0xfe) * 16384 // 1 << 14
        + (data[12] & 0xff) * 128 // 1 << 7
        + (data[13] & 0xfe) / 2;

      if (ptsDtsFlags & 0x40) {
        dts = (data[14] & 0x0e) * 536870912 // 1 << 29
          + (data[15] & 0xff) * 4194304 // 1 << 22
          + (data[16] & 0xfe) * 16384 // 1 << 14
          + (data[17] & 0xff) * 128 // 1 << 7
          + (data[18] & 0xfe) / 2;
        if (pts - dts > 60 * TS_SECOND) pts = dts;
      } else {
        dts = pts;
      }
    }

    return { data: data.subarray(9 + headerDataLen), pts, dts };
  }
}
