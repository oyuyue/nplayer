import { Fragment } from './fragment';
import { Stream } from './stream';

export class Playlist {
  currentStreamIndex = 0

  currentFragmentIndex = -1

  streams: Stream[] = []

  get currentStream() {
    return this.streams[this.currentStreamIndex];
  }

  nextFragment(): Fragment | void {
    return this.currentStream?.fragments[++this.currentFragmentIndex];
  }
}
