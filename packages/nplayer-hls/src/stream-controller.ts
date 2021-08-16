import { BufferController } from './buffer-controller';
import { Fragment } from './fragment';
import { parseMedia } from './m3u8';
import { Playlist } from './playlist';
import { Stream } from './stream';
import { Transmuxer } from './transmuxer';
import { TrackType } from './types';

export class StreamController {
  playlist = new Playlist();

  transmuxer = new Transmuxer()

  bufferController = new BufferController();

  totalDuration = 0

  load(url: string) {
    fetch(url)
      .then((res) => res.text())
      .then((text) => {
        const media = parseMedia(text, url);
        this.totalDuration = media.totalDuration;
        const stream = new Stream();
        stream.fragments = media.frags;
        this.playlist.streams = [stream];

        this.loadFragment();
      });
  }

  t = 0

  loadFragment() {
    const frag = this.playlist.nextFragment();
    if (frag) {
      fetch(frag.url)
        .then((res) => res.arrayBuffer())
        .then((buffer) => {
          if (this.t < 2) this.loadFragment();
          this.t++;
          this.transmux(new Uint8Array(buffer), frag);
        });
    }
  }

  transmux(data: Uint8Array, frag: Fragment) {
    const ret = this.transmuxer.transmux(data, frag.start, this.totalDuration, true);

    if (ret.videoInitSegment) {
      this.bufferController.createSourceBuffer(this.transmuxer.videoTrack);
      this.bufferController.append(TrackType.VIDEO, ret.videoInitSegment);
    }
    if (ret.audioInitSegment) {
      this.bufferController.createSourceBuffer(this.transmuxer.audioTrack);
      this.bufferController.append(TrackType.AUDIO, ret.audioInitSegment);
    }
    if (ret.videoChunk) {
      this.bufferController.append(TrackType.VIDEO, ret.videoChunk);
    }
    if (ret.audioChunk) {
      this.bufferController.append(TrackType.AUDIO, ret.audioChunk);
    }
  }
}
