import {
  AudioSample, AudioTrack, TrackType, SampleFlag,
} from './types';

export class AacSample implements AudioSample {
  data: Uint8Array;

  duration = 0;

  size = 0;

  cts = 0;

  pts = 0;

  flag: SampleFlag = {
    isLeading: 0,
    dependsOn: 1,
    isDependedOn: 0,
    hasRedundancy: 0,
    paddingValue: 0,
    degradationPriority: 0,
    isNonSyncSample: 1,
  }

  constructor(pts: number, duration: number, data: Uint8Array) {
    this.pts = pts;
    this.duration = duration;
    this.data = data;
  }
}

export class AacTrack implements AudioTrack {
  type = TrackType.AUDIO;

  sampleSize = 16;

  audioObjectType?: number;

  id = 0;

  baseMediaDecodeTime = 0;

  duration = 0;

  size = 0;

  timescale = 90000;

  pid = -1;

  dropped = 0

  samples: AudioSample[] = []

  sampleRate?: number;

  samplingFrequencyIndex?: number

  objectType?: number

  channelCount?: number

  codec = ''

  get lastSample() {
    return this.samples[this.samples.length - 1];
  }

  pushSamples(samples: { data: Uint8Array, pts: number, duration: number }[]): void {
    if (samples && samples.length) {
      this.samples.push(...samples.map((s) => new AacSample(s.pts, s.duration, s.data)));
    }
  }
}
