import {
  AudioSample, AudioTrack, TrackType, SampleFlag,
} from './types';

export class AacSample implements AudioSample {
  readonly data: Uint8Array;

  readonly size: number;

  readonly cts = 0;

  duration = 1024;

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

  constructor(pts: number, data: Uint8Array, duration?: number) {
    this.pts = pts;
    this.data = data;
    this.size = data.byteLength;
    if (duration) this.duration = duration;
  }
}

export class AacTrack implements AudioTrack {
  readonly container = 'audio/mp4'

  readonly id = 2;

  readonly type = TrackType.AUDIO;

  sequenceNumber = 0;

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
}
