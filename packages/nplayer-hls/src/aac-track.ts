import { Track, TrackType } from './types';

export class AacTrack implements Track {
  type = TrackType.AUDIO

  pid = -1;

  dropped = 0

  samples: { data: Uint8Array, pts: number }[] = []

  sampleRate?: number;

  samplingFrequencyIndex?: number

  objectType?: number

  channelCount?: number

  codec = ''

  get lastSample() {
    return this.samples[this.samples.length - 1];
  }
}
