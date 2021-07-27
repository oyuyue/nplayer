import { Track, TrackType } from './types';

export class AvcSample {
  isFrame = false;

  isKeyFrame = false;

  pts: number | undefined;

  dts: number | undefined;

  units: Uint8Array[] = [];

  constructor(pts?: number, dts?: number) {
    this.pts = pts;
    this.dts = dts;
  }
}

export class AvcTrack implements Track {
  type = TrackType.VIDEO

  pid = -1;

  dropped = 0;

  samples: AvcSample[] = [];

  pps: Uint8Array | undefined;

  sps: Uint8Array | undefined;

  codec = '';

  width?: number;

  height?: number;

  get lastSample() {
    return this.samples[this.samples.length - 1];
  }

  pushSample(sample: AvcSample): boolean {
    if (sample && sample.units.length && sample.isFrame) {
      if (sample.pts == null) {
        const lastSample = this.lastSample;
        if (lastSample) {
          sample.pts = lastSample.pts;
          sample.dts = lastSample.dts;
        } else {
          this.dropped++;
          return false;
        }
      }
      this.samples.push(sample);
      return true;
    }
    return false;
  }
}
