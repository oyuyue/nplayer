import { SampleFlag } from './types';

export class VideoSample {
  frame = false;

  key = false;

  duration = 0;

  size = 0;

  units: Uint8Array[] = [];

  pts;

  dts;

  flag: SampleFlag = {}

  get cts(): number {
    return this.pts - this.dts;
  }

  constructor(pts: number, dts: number) {
    this.pts = pts;
    this.dts = dts;
  }
}
