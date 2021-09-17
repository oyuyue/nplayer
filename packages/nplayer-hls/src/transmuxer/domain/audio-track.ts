import { AudioSample } from './audio-sample';
import { TrackType } from './types';

export class AudioTrack {
  readonly id = 2;

  readonly type = TrackType.AUDIO;

  pid = -1;

  sequenceNumber = 0;

  sampleSize = 16;

  timescale = 0;

  baseMediaDecodeTime = 0;

  duration = 0;

  samples: AudioSample[] = [];

  codec = ''

  sampleRate?: number;

  samplingFrequencyIndex?: number

  objectType?: number

  channelCount?: number

  exist(): boolean {
    return !!this.samples.length;
  }

  reset(): void {
    this.sequenceNumber = 0;
    this.samples = [];
  }
}
