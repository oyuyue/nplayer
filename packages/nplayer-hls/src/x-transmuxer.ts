import { MP4Remuxer, TsDemuxer } from './transmuxer';

export class Transmuxer {
  readonly demuxer = new TsDemuxer()

  readonly remuxer = new MP4Remuxer(this.demuxer.videoTrack, this.demuxer.audioTrack)

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
    contiguous?: boolean,
  ) {
    this.demux(data, timeOffset, contiguous);
    return this.remuxer.remux(true);
  }
}
