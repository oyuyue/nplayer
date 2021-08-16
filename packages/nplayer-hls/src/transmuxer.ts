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
    contiguous?: boolean,
  ) {
    this.demuxer.demux(data, timeOffset, contiguous);
  }

  transmux(
    data: Uint8Array,
    timeOffset: number,
    totalDuration = 0,
    contiguous?: boolean,
  ) {
    this.demux(data, timeOffset, contiguous);
    if (totalDuration) {
      this.videoTrack.duration = totalDuration * this.videoTrack.timescale;
      this.audioTrack.duration = totalDuration * this.audioTrack.timescale;
    } else {
      this.videoTrack.duration = this.audioTrack.duration = 0xffffffff;
    }
    return this.remuxer.remux();
  }
}
