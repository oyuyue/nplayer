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

  load(url: string) {
    fetch(url)
      .then((res) => res.text())
      .then((text) => {
        const media = parseMedia(text, url);
        const stream = new Stream();
        stream.fragments = media.frags;
        this.playlist.streams = [stream];

        this.loadFragment();
      });
  }

  loadFragment() {
    const frag = this.playlist.nextFragment();
    if (frag) {
      fetch(frag.url)
        .then((res) => res.arrayBuffer())
        .then((buffer) => {
          // this.loadFragment();
          this.transmux(new Uint8Array(buffer), frag);
        });
    }
  }

  transmux(data: Uint8Array, frag: Fragment) {
    const ret = this.transmuxer.transmux(data, frag);
    if (ret.videoInitSegment) {
      this.bufferController.createSourceBuffer(ret.videoTrack);
      this.bufferController.append(TrackType.VIDEO, ret.videoInitSegment);
    }
    if (ret.audioInitSegment) {
      this.bufferController.createSourceBuffer(ret.audioTrack);
      this.bufferController.append(TrackType.AUDIO, ret.audioInitSegment);
    }

    if (ret.video) this.bufferController.append(TrackType.VIDEO, ret.video);
    if (ret.audio) this.bufferController.append(TrackType.AUDIO, ret.audio);
  }
}
