import { AacTrack } from './aac-track';
import { ADTS } from './adts';
import { AVC } from './avc';
import { AvcSample, AvcTrack } from './avc-track';
import { ExpGolomb } from './exp-golomb';
import { concatUint8Array } from './utils';

export class TsDemuxer {
  private pmtId = -1;

  private readonly avcTrack = new AvcTrack();

  private readonly aacTrack = new AacTrack();

  private remainingPacketData?: Uint8Array;

  private remainingNALuData?: Uint8Array;

  private remainingAacData?: Uint8Array;

  private prevAvcSample?: AvcSample;

  private avcPesData: Uint8Array[] = []

  private aacPesData: Uint8Array[] = []

  demux(data: Uint8Array) {
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

    let avcPid = this.avcTrack.pid;
    let aacPid = this.avcTrack.pid;

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
                this.aacTrack.pid = aacPid = esPid;
                break;
              case 0x1b:
                this.avcTrack.pid = avcPid = esPid;
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
              let buffer = pes.data;
              if (this.remainingNALuData) {
                buffer = new Uint8Array(this.remainingNALuData.length + pes.data.length);
                buffer.set(this.remainingNALuData);
                buffer.set(pes.data, this.remainingNALuData.length);
              }
              const { units, remaining } = AVC.parseAnnexBNALus(buffer);
              if (units) this.createAvcSample(units, pes.pts, pes.dts);
              this.remainingNALuData = remaining;
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
                if (!this.aacTrack.lastSample || !this.aacTrack.sampleRate) break;
                pts = this.aacTrack.lastSample.pts! + ADTS.getFrameDuration(this.aacTrack.sampleRate);
              }

              let buffer = pes.data;
              if (this.remainingAacData) {
                buffer = new Uint8Array(this.remainingAacData.length + pes.data.length);
                buffer.set(this.remainingAacData);
                buffer.set(pes.data, this.remainingAacData.length);
              }

              const ret = ADTS.parse(buffer, pts);
              if (!ret) break;

              this.aacTrack.codec = ret.codec;
              this.aacTrack.channelCount = ret.channelCount;
              this.aacTrack.objectType = ret.objectType;
              this.aacTrack.sampleRate = ret.sampleRate;
              this.aacTrack.samplingFrequencyIndex = ret.samplingFrequencyIndex;
              this.aacTrack.pushSamples(ret.frames);

              // TODO: ret.skip warning

              this.remainingAacData = ret.remaining;
            }
            this.aacPesData = [];
          }
          this.aacPesData.push(data.subarray(offset, start + 188));
          break;
      }
    }

    return {
      videoTrack: this.avcTrack,
      audioTrack: this.aacTrack,
    };
  }

  dispose() {
    this.remainingPacketData = undefined;
  }

  private createAvcSample(units: Uint8Array[], pts?: number, dts?: number) {
    if (!units.length) return;
    const track = this.avcTrack;
    let sample = this.prevAvcSample || (this.prevAvcSample = new AvcSample(pts!, dts!));

    units.forEach((unit) => {
      const type = unit[0] & 0x1f;
      switch (type) {
        case 1: // NDR
          sample.isFrame = true;

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
              sample.isKeyFrame = true;
              sample.flag.dependsOn = 2;
              sample.flag.isNonSyncSample = 0;
            }
          }
          break;
        case 5: // IDR
          sample.isKeyFrame = sample.isFrame = true;
          sample.flag.dependsOn = 2;
          sample.flag.isNonSyncSample = 0;
          break;
        case 6: // SEI
          AVC.parseSEI(AVC.removeEPB(unit));
          break;
        case 7: // SPS
          if (!track.sps.length) {
            track.sps = [unit];
            const spsInfo = AVC.parseSPS(unit);
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
            track.samples.push(sample);
            sample = this.prevAvcSample = new AvcSample(pts!, dts!);
          }
          break;
        case 12: // filler_data
          return;
      }
      sample.units.push(unit);
    });
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
        if (pts - dts > 60 * 90000) pts = dts;
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
}
