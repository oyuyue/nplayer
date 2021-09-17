import { VideoSample } from './video-sample';
import { TrackType } from './types';

export class VideoTrack {
  readonly id = 1;

  readonly type = TrackType.VIDEO

  pid = -1;

  sequenceNumber = 0;

  dropped = 0;

  timescale = 90000;

  profileIdc?: number;

  profileCompatibility?: number;

  levelIdc?: number;

  sarRatio: [number, number] = [1, 1];

  baseMediaDecodeTime = 0;

  duration = 0;

  samples: VideoSample[] = [];

  pps: Uint8Array[] = [];

  sps: Uint8Array[] = [];

  codec = '';

  width = 0;

  height = 0;

  exist(): boolean {
    return !!this.samples.length;
  }

  reset(): void {
    this.sequenceNumber = 0;
    this.pps = [];
    this.sps = [];
    this.samples = [];
  }
}
