import { BufferController } from './buffer-controller';
import { parseMedia } from './m3u8';
import { MP4Remuxer } from './mp4-remuxer';
import { TsDemuxer } from './ts-demuxer';

export default class Hls {
  demuxer = new TsDemuxer()

  remuxer = new MP4Remuxer()

  buf = new BufferController()

  initGen = false;

  constructor() {
    const video = document.createElement('video');
    document.body.appendChild(video);
    this.buf.attachMedia(video);
  }

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

    tracks.videoTrack.duration = 10;

    if (!this.initGen) {
      this.buf.createSourceBuffer(tracks.videoTrack);
      const init = this.remuxer.createInitSegment(tracks.videoTrack, tracks.audioTrack);
      this.buf.append(tracks.videoTrack.type, init.video);
      this.initGen = true;
    }

    const chunk = this.remuxer.remuxVideo(tracks.videoTrack);

    console.log(tracks.videoTrack);

    this.buf.append(tracks.videoTrack.type, chunk);

    // const init = MP4.initSegment([tracks.videoTrack]);
    // const moof = MP4.moof(0, [tracks.videoTrack, tracks.audioTrack]);

    // const d = new Uint8Array(init.byteLength + moof.byteLength);
    // d.set(init);
    // d.set(moof, init.byteLength);

    // const a = document.createElement('a');
    // a.download = 'd.mp4';
    // a.innerHTML = 'download';
    // const blob = new Blob([d]);
    // a.href = URL.createObjectURL(blob);
    // document.body.appendChild(a);
  }
}
