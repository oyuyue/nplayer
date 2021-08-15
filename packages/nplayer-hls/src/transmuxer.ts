import { AacTrack } from './aac-track';
import { AvcTrack } from './avc-track';
import { MP4Remuxer } from './mp4-remuxer';
import { TsDemuxer } from './ts-demuxer';

export class Transmuxer {
  readonly audioTrack = new AacTrack()

  readonly videoTrack = new AvcTrack();

  readonly demuxer = new TsDemuxer(this.videoTrack, this.audioTrack)

  readonly remuxer = new MP4Remuxer(this.videoTrack, this.audioTrack)

  demux(
    data: Uint8Array,
    timeOffset: number,
    duration: number,
    cc: number,
    contiguous?: boolean,
    fix?: boolean,
  ) {
    this.demuxer.demux(data, timeOffset, duration, cc, contiguous, fix);
  }

  transmux(
    data: Uint8Array,
    timeOffset: number,
    duration: number,
    cc: number,
    totalDuration = 0xffffffff,
    contiguous?: boolean,
    fix?: boolean,
  ) {
    this.videoTrack.duration = this.audioTrack.duration = totalDuration;
    this.demux(data, timeOffset, duration, cc, contiguous, fix);
    this.remuxer.remux();
  }
}
