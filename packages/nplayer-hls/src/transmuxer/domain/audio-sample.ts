import { SampleFlag } from './types';

export class AudioSample {
  readonly data: Uint8Array;

  readonly size: number;

  duration = 1024;

  pts;

  flag: SampleFlag = {}

  constructor(pts: number, data: Uint8Array, duration?: number) {
    this.pts = pts;
    this.data = data;
    this.size = data.byteLength;
    if (duration) this.duration = duration;
  }
}
