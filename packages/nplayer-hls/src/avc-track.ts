import {
  SampleFlag,
  TrackType, VideoSample, VideoTrack,
} from './types';

export class AvcSample implements VideoSample {
  isFrame = false;

  isKeyFrame = false;

  duration = 0;

  size = 0;

  units: Uint8Array[] = [];

  flag: SampleFlag = {
    isLeading: 0,
    dependsOn: 1,
    isDependedOn: 0,
    hasRedundancy: 0,
    paddingValue: 0,
    degradationPriority: 0,
    isNonSyncSample: 1,
  }

  pts = 0;

  dts = 0;

  debug = '';

  get cts() {
    return this.pts - this.dts;
  }

  constructor(pts: number, dts: number) {
    this.pts = pts;
    this.dts = dts;
  }
}

export class AvcTrack implements VideoTrack {
  type = TrackType.VIDEO

  profileIdc?: number;

  profileCompatibility?: number;

  levelIdc?: number;

  sarRatio: [number, number] = [1, 1];

  id = 0;

  baseMediaDecodeTime = 0;

  duration = 0;

  timescale = 0;

  pid = -1;

  dropped = 0;

  samples: AvcSample[] = [];

  pps: Uint8Array[] = [];

  sps: Uint8Array[] = [];

  codec = '';

  width = 0;

  height = 0;

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
