import Component from './component';
import Controls from './controls';
import Events from './events';
import { getDomOr } from './utils';

interface RPlayerOptions {
  media?: string | HTMLVideoElement;
  el?: string | HTMLElement;
  video?: HTMLVideoElement & { src?: string | string[] };
}

class RPlayer extends Component {
  readonly media: HTMLVideoElement;

  el: HTMLElement;
  controls: Controls;
  options: RPlayerOptions = {};
  readonly Events = Events;

  constructor(options: RPlayerOptions = {}) {
    super();
    this.options = options;

    this.media = getDomOr(this.options.media, document.createElement('video'));
    this.el = getDomOr(this.options.el, document.body);
    this.addClass('rplayer');

    if (options.video) {
      const { src, ...rest } = options.video;
      if (typeof src === 'string') {
        this.media.src = src;
      } else if (Array.isArray(src)) {
        src.forEach((s) => this.media.canPlayType(s) && (this.media.src = s));
      }

      Object.keys(rest).forEach((key) => {
        (this.media as any)[key] = (rest as any)[key];
      });
    }

    this.controls = new Controls(this);
  }

  mount(el?: HTMLElement): this {
    if (el) this.el = el;
    this.emit(Events.BEFORE_MOUNT);
    this.appendChild(this.media);
    this.el.appendChild(this.dom);
    return this;
  }

  play(): void {
    this.media.play();
  }

  pause(): void {
    this.media.pause();
  }

  toggle(): void {
    if (this.media.paused) {
      this.play();
    } else {
      this.pause();
    }
  }
}

export default RPlayer;
