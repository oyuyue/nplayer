import { parseMedia } from './m3u8';
import { MP4 } from './mp4';
import { TsDemuxer } from './ts-demuxer';

export default class Hls {
  demuxer = new TsDemuxer()

  load(url: string): void {
    fetch(url)
      .then((res) => res.text())
      .then((text) => {
        const frags = parseMedia(text, url).frags;
        const index = 0;
        this.loadFrag(frags[index]);
      });
  }

  loadFrag(frag: any) {
    fetch(frag.url)
      .then((res) => res.arrayBuffer())
      .then((buf) => this.demux(new Uint8Array(buf)));
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  demux(data: Uint8Array) {
    const tracks = this.demuxer.demux(data);
    const init = MP4.initSegment([tracks.videoTrack]);
  }
}
