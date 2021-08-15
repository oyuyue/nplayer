import { StreamController } from './stream-controller';

export default class Hls {
  streamController = new StreamController()

  constructor() {
    const video = document.createElement('video');
    video.controls = true;
    document.body.appendChild(video);
    this.streamController.bufferController.attachMedia(video);
  }

  load(url: string) {
    this.streamController.load(url);
  }
}
