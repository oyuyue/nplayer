import {
  AudioSample, AudioTrack, TrackType, SampleFlag,
} from './types';

export class AacSample implements AudioSample {
  readonly data: Uint8Array;

  readonly size: number;

  duration = 1024;

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

  constructor(pts: number, data: Uint8Array) {
    this.pts = pts;
    this.data = data;
    this.size = data.byteLength;
  }
}

export class AacTrack implements AudioTrack {
  readonly container = 'audio/mp4'

  readonly id = 2;

  readonly type = TrackType.AUDIO;

  sampleSize = 16;

  timescale = 0;

  baseMediaDecodeTime = 0;

  pid = -1;

  duration = 0;

  samples: AudioSample[] = [];

  codec = ''

  sampleRate?: number;

  samplingFrequencyIndex?: number

  objectType?: number

  channelCount?: number

  get lastSample(): AudioSample {
    return this.samples[this.samples.length - 1];
  }

  pushSamples(samples: { data: Uint8Array, pts: number }[]): void {
    if (samples && samples.length) {
      this.samples.push(...samples.map((s) => new AacSample(s.pts, s.data)));
    }
  }
}
