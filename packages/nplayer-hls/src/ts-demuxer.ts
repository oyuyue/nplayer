import { AacSample } from './aac-track';
import { ADTS } from './adts';
import { AVC } from './avc';
import { AvcSample } from './avc-track';
import { ExpGolomb } from './exp-golomb';
import {
  AudioTrack, Sample, VideoSample, VideoTrack,
} from './types';
import { concatUint8Array } from './utils';

const MAX_SEGMENT_HOLE = 90000;
const TS_SECOND = 90000;

export class TsDemuxer {
  private pmtId = -1;

  private remainingPacketData?: Uint8Array;

  private remainingAacData?: Uint8Array;

  private prevAvcSample?: AvcSample;

  private avcPesData: Uint8Array[] = []

  private aacPesData: Uint8Array[] = []

  private nextVideoPts?: number;

  private nextAudioPts?: number;

  private initPts?: number;

  private initPtsMap: Record<number, number> = Object.create(null);

  constructor(readonly videoTrack: VideoTrack, readonly audioTrack: AudioTrack) {
    this.videoTrack = videoTrack;
    this.audioTrack = audioTrack;
  }

  demux(
    data: Uint8Array,
    timeOffset: number,
    duration: number,
    cc: number,
    contiguous = true,
    fix = true,
  ) {
    if (!contiguous) {
      this.remainingPacketData = this.prevAvcSample = this.remainingAacData = undefined;
      this.avcPesData = [];
      this.aacPesData = [];
    }

    if (this.remainingPacketData) {
      data = concatUint8Array(this.remainingPacketData, data);
      this.remainingPacketData = undefined;
    }

    const syncOffset = TsDemuxer.getSyncOffset(data);
    if (syncOffset === -1) {
      this.remainingPacketData = undefined;
      throw new Error('TS packet did not start with 0x47');
    }

    let dataLen = data.length;
    const remainingLength = (dataLen - syncOffset) % 188;
    if (remainingLength) {
      this.remainingPacketData = data.subarray(dataLen - remainingLength);
      dataLen -= remainingLength;
    }

    this.videoTrack.samples = [];
    this.audioTrack.samples = [];

    let avcPid = this.videoTrack.pid;
    let aacPid = this.audioTrack.pid;

    for (let start = syncOffset, len = data.length; start < len; start += 188) {
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
          // TODO: cache pes
          break;
        case this.pmtId: {
          if (payloadUnitStartIndicator) offset += data[offset] + 1;
          const tableEnd = offset + 3 + (((data[offset + 1] & 0x0f) << 8) | data[offset + 2]) - 4;
          const programInfoLength = ((data[offset + 10] & 0x0f) << 8) | data[offset + 11];
          offset += 12 + programInfoLength;

          while (offset < tableEnd) {
            const esPid = ((data[offset + 1] & 0x1f) << 8) | data[offset + 2];

            switch (data[offset]) {
              case 0x0f:
                this.audioTrack.pid = aacPid = esPid;
                break;
              case 0x1b:
                this.videoTrack.pid = avcPid = esPid;
                break;
            }

            offset += (((data[offset + 3] & 0x0f) << 8) | data[offset + 4]) + 5;
          }
        }
          break;
        case avcPid:
          if (payloadUnitStartIndicator && this.avcPesData.length) {
            const pes = TsDemuxer.parsePES(concatUint8Array(...this.avcPesData));
            if (pes) {
              const units = AVC.parseAnnexBNALus(pes.data);
              if (units) this.createVideoSample(units, pes.pts, pes.dts);
            }
            this.avcPesData = [];
          }
          this.avcPesData.push(data.subarray(offset, start + 188));
          break;
        case aacPid:
          if (payloadUnitStartIndicator && this.aacPesData.length) {
            const pes = TsDemuxer.parsePES(concatUint8Array(...this.aacPesData));
            if (pes) {
              let pts = pes.pts;
              if (pts == null) {
                if (!this.audioTrack.samples.length || !this.audioTrack.sampleRate) break;
                pts = this.audioTrack.samples[this.audioTrack.samples.length - 1].pts!
                      + ADTS.getFrameDuration(this.audioTrack.sampleRate);
              }

              let buffer = pes.data;
              if (this.remainingAacData) {
                buffer = new Uint8Array(this.remainingAacData.length + pes.data.length);
                buffer.set(this.remainingAacData);
                buffer.set(pes.data, this.remainingAacData.length);
              }

              const ret = ADTS.parse(buffer, pts);
              if (!ret) break;

              this.audioTrack.codec = ret.codec;
              this.audioTrack.channelCount = ret.channelCount;
              this.audioTrack.objectType = ret.objectType;
              this.audioTrack.sampleRate = ret.sampleRate;
              this.audioTrack.samplingFrequencyIndex = ret.samplingFrequencyIndex;
              this.audioTrack.samples.push(...ret.frames.map((s) => new AacSample(s.pts, s.data)));

              // TODO: ret.skip warning

              this.remainingAacData = ret.remaining;
            }
            this.aacPesData = [];
          }
          this.aacPesData.push(data.subarray(offset, start + 188));
          break;
      }
    }

    if (this.prevAvcSample && this.videoTrack.pushSample(this.prevAvcSample)) {
      this.prevAvcSample = undefined;
    }

    this.videoTrack.timescale = TS_SECOND;
    this.audioTrack.timescale = this.audioTrack.sampleRate || 0;

    if (fix) {
      this.fix(timeOffset, duration, cc, contiguous);
    }

    return {
      videoTrack: this.videoTrack,
      audioTrack: this.audioTrack,
    };
  }

  fix(timeOffset: number, duration: number, cc: number, contiguous = true) {
    const audioSamples = this.audioTrack.samples;
    let videoSamples = this.videoTrack.samples;

    const hasAudio = audioSamples.length > 1;
    const hasVideo = videoSamples.length > 1;

    this.initPts = this.initPtsMap[cc];
    if (this.initPts == null) {
      const startOffset = timeOffset * TS_SECOND;
      this.initPts = Infinity;
      if (hasAudio) {
        this.initPts = audioSamples[0].pts - startOffset;
      } else if (hasAudio) {
        this.initPts = Math.min(this.initPts, TsDemuxer.getStartPts(videoSamples) - startOffset);
      }
      if (!Number.isFinite(this.initPts)) return;

      this.initPtsMap[cc] = this.initPts;
    }

    if (hasVideo && !contiguous) {
      let keyIndex = 0;
      for (let i = 0, l = videoSamples.length; i < l; i++) {
        if (videoSamples[i].key) {
          keyIndex = i;
          break;
        }
      }

      if (keyIndex > 0 && keyIndex < videoSamples.length - 1) {
        this.videoTrack.samples = videoSamples = videoSamples.slice(keyIndex);
        this.videoTrack.dropped += keyIndex;
      }
    }

    if (hasAudio) this.fixAudio(timeOffset, duration, contiguous);
    if (hasVideo) {
      this.fixVideo(timeOffset, duration, contiguous, this.audioTrack.samples[0]?.pts);
    }

    if (hasAudio) {
      const audioDts = audioSamples[0]?.pts;
      if (audioDts != null) this.audioTrack.baseMediaDecodeTime = audioDts * TS_SECOND / this.audioTrack.timescale;
    }

    if (hasVideo) {
      const videoDts = videoSamples[0]?.dts;
      if (videoDts != null) this.videoTrack.baseMediaDecodeTime = videoDts;
    }
  }

  private fixVideo(timeOffset: number, duration: number, contiguous: boolean, audioStartPts?: number) {
    timeOffset *= TS_SECOND;
    duration *= TS_SECOND;
    const samples = this.videoTrack.samples;

    let sortSamples = false;
    let ptsDtsShift = 0;

    if (!contiguous || this.nextVideoPts == null) {
      if (audioStartPts != null) timeOffset = audioStartPts;
      this.nextVideoPts = Math.max(0, timeOffset);
    }

    samples.forEach((sample, i) => {
      sample.pts = TsDemuxer.normalizePts(sample.pts - this.initPts!, this.nextVideoPts);
      sample.dts = TsDemuxer.normalizePts(sample.dts - this.initPts!, this.nextVideoPts);

      if (sample.dts > sample.pts) {
        ptsDtsShift = Math.min(sample.pts - sample.dts, ptsDtsShift);
      }

      if (sample.dts < samples[i > 0 ? i - 1 : i].dts) {
        sortSamples = true;
      }
    });

    if (sortSamples) samples.sort((a, b) => a.dts - b.dts || a.pts - a.pts);

    if (ptsDtsShift < 0) {
      samples.forEach((sample) => sample.dts += ptsDtsShift);
    }

    const delta = samples[0].pts - this.nextVideoPts;

    if (delta) {
      const sample0 = samples[0];
      const sample1 = samples[1];

      let cts = sample0.pts - sample0.dts;
      sample0.pts = this.nextVideoPts;
      sample0.dts = Math.max(this.nextVideoPts - cts, 0);

      if (sample1.dts <= sample0.dts || sample1.dts > sample0.dts + MAX_SEGMENT_HOLE) {
        for (let i = 1, l = samples.length, sample: VideoSample; i < l; i++) {
          sample = samples[i];
          cts = sample.pts - sample.dts;
          sample.pts -= delta;
          sample.dts = Math.max(sample.pts - cts, 0);
        }
      }
    }

    for (let i = 0, l = this.videoTrack.samples.length, curSample: VideoSample, nextSample: VideoSample; i < l; i++) {
      curSample = this.videoTrack.samples[i];
      nextSample = this.videoTrack.samples[i + 1];

      if (nextSample) {
        curSample.duration = nextSample.pts - curSample.pts;
      } else {
        let sampleDuration = 0;
        if (this.nextAudioPts) sampleDuration = this.nextAudioPts - curSample.pts;
        if (sampleDuration < 0) sampleDuration = duration - curSample.pts;
        curSample.duration = sampleDuration > 0 ? sampleDuration : samples[i - 1].duration;
      }
    }

    const lastSample = samples[samples.length - 1];
    this.nextVideoPts = lastSample.pts + lastSample.duration;
  }

  private fixAudio(timeOffset: number, duration: number, contiguous: boolean) {
    timeOffset *= TS_SECOND;
    duration *= TS_SECOND;
    const track = this.audioTrack;
    const samples = track.samples;
    samples.forEach((sample) => {
      sample.pts = TsDemuxer.normalizePts(sample.pts - this.initPts!, timeOffset);
    });

    const sampleDuration = 1024 * TS_SECOND / track.timescale;

    if (this.nextAudioPts == null) {
      this.nextAudioPts = timeOffset;
    }

    if (!contiguous) {
      this.nextAudioPts = samples[0].pts;
    } else if (this.nextVideoPts != null) {
      const delta = this.nextVideoPts - this.nextAudioPts;
      if (delta > 0) duration += delta;
    }

    let nextPts = this.nextAudioPts;
    samples.slice().forEach((sample, i) => {
      const delta = sample.pts - nextPts;

      if (delta > sampleDuration) {
        let missing = delta / sampleDuration;
        if (missing > 1.5) {
          missing = Math.floor(missing);

          while (missing--) {
            const frame = ADTS.getSilentFrame(track.codec, track.channelCount) || sample.data.subarray();
            samples.splice(i, 0, new AacSample(nextPts, frame, 1024));
            nextPts += sampleDuration;
          }
        }
      }

      sample.pts = nextPts;
      sample.duration = 1024;
      nextPts += sampleDuration;
    });

    const lastPts = samples[samples.length - 1].pts;
    const expectLastPts = samples[0].pts + duration;
    const delta = expectLastPts - lastPts;
    if (delta > sampleDuration) {
      const lastSample = samples[samples.length - 1];
      let missing = Math.floor(delta / sampleDuration);
      if (missing > 0) {
        while (missing--) {
          const frame = ADTS.getSilentFrame(track.codec, track.channelCount) || lastSample.data.subarray();
          samples.push(new AacSample(nextPts, frame, 1024));
          nextPts += sampleDuration;
        }
      }
    } else if (-delta > MAX_SEGMENT_HOLE) {
      let sample = samples.pop();
      while (sample) {
        if (sample.pts <= expectLastPts) {
          samples.push(sample);
          break;
        }
        sample = samples.pop();
      }
    }

    this.nextAudioPts = samples[samples.length - 1].pts + sampleDuration;
  }

  private createVideoSample(units: Uint8Array[], pts?: number, dts?: number) {
    if (!units.length) return;
    const track = this.videoTrack;
    let sample = this.prevAvcSample || (this.prevAvcSample = new AvcSample(pts!, dts!));
    units.forEach((unit) => {
      const type = unit[0] & 0x1f;
      switch (type) {
        case 1: // NDR
          sample.frame = true;
          sample.debug += 'NDR';

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
          sample.debug += 'IDR';
          sample.key = sample.frame = true;
          sample.flag.dependsOn = 2;
          sample.flag.isNonSyncSample = 0;
          break;
        case 6: // SEI
          sample.debug += 'SEI';
          AVC.parseSEI(AVC.removeEPB(unit));
          break;
        case 7: // SPS
          sample.debug += 'SPS';
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
          sample.debug += 'PPS';
          if (!track.pps.length) track.pps = [unit];
          break;
        case 9: // AUD
          sample.debug += 'AUD';

          if (sample.units.length) {
            track.pushSample(sample);
            sample = this.prevAvcSample = new AvcSample(pts!, dts!);
          }

          break;
      }
      sample.units.push(unit);
    });
  }

  private static normalizePts(value: number, reference?: number): number {
    let offset;
    if (reference == null) return value;

    if (reference < value) {
      // - 2^33
      offset = -8589934592;
    } else {
      // + 2^33
      offset = 8589934592;
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

  private static getSyncOffset(data: Uint8Array) {
    const len = Math.min(1000, data.length);
    for (let i = 0; i < len; i++) {
      if (data[i] === 0x47) return i;
    }
    return -1;
  }

  private static getStartPts(samples: Sample[]) {
    const startPTS = samples.reduce((minPTS, sample) => {
      const delta = sample.pts - minPTS;
      if (delta < -4294967296) {
        return TsDemuxer.normalizePts(minPTS, sample.pts);
      } if (delta > 0) {
        return minPTS;
      }
      return sample.pts;
    }, samples[0].pts);

    return startPTS;
  }
}
