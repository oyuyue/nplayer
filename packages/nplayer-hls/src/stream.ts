import { Fragment } from './fragment';

export class Stream {
  url = '';

  codec = '';

  bitrate = 0;

  live = false;

  fragments: Fragment[] = [];

  update() {

  }
}
