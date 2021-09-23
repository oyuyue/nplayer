import { Segment } from '../streaming/types';

export class HlsSegment implements Segment {
  url = '';

  start = 0;

  duration = 0;

  sn = 0;

  periodId = 0;

  byteRange?: [number, number];

  title?: string;

  wallClockTime?: number;

  invalid?: boolean;

  get end() {
    return this.start + this.duration;
  }
}
