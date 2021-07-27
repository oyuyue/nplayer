import { parseMedia } from './m3u8';

export default class Hls {
  avcData = { data: [], size: 0 }

  audioData = { data: [], size: 0 }

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

  }
}
