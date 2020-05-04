import Component from './component';
import Controls from './controls';
import Events from './events';
import Fullscreen from './fullscreen';
import setupMediaEvents from './media-events';
import { clamp, getDomOr } from './utils';

interface RPlayerOptions {
  media?: string | HTMLVideoElement;
  el?: string | HTMLElement;
  video?: HTMLVideoElement & { src?: string | string[] };
}

class RPlayer extends Component {
  el: HTMLElement;

  readonly options: RPlayerOptions = {};
  readonly media: HTMLVideoElement;
  readonly Events = Events;
  readonly fullscreen: Fullscreen;
  readonly controls: Controls;

  prevVolume = 1;

  fullscreenClass = 'rplayer-full';
  pausedClass = 'rplayer-paused';

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

    this.prevVolume = this.media.volume;

    this.fullscreen = new Fullscreen(this);
    this.controls = new Controls(this);

    this.setupFullscreen();
    setupMediaEvents(this, this.media);
    this.setupClassNames();
  }

  private setupFullscreen(): void {
    if (this.fullscreen.isActive) this.addClass(this.fullscreenClass);

    this.on(Events.ENTER_FULLSCREEN, () => {
      this.addClass(this.fullscreenClass);
    }).on(Events.EXIT_FULLSCREEN, () => {
      this.removeClass(this.fullscreenClass);
    });

    this.dom.addEventListener(
      'dblclick',
      (ev) => {
        ev.preventDefault();
        if (this.controls.bottom.dom.contains(ev.target as any)) return;
        this.fullscreen.toggle();
      },
      true
    );
  }

  private setupClassNames(): void {
    if (this.media.paused) this.addClass(this.pausedClass);

    this.on(Events.PLAY, () =>
      this.removeClass(this.pausedClass)
    ).on(Events.PAUSE, () => this.addClass(this.pausedClass));
  }

  get currentTime(): number {
    return this.media.currentTime;
  }

  get duration(): number {
    return this.media.duration;
  }

  mount(el?: HTMLElement): this {
    if (el) this.el = el;
    this.emit(Events.BEFORE_MOUNT);
    this.appendChild(this.media);
    this.el.appendChild(this.dom);
    this.emit(Events.MOUNTED);
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

  volume(v?: number): number {
    if (v != null) this.media.volume = clamp(v);
    return this.media.volume;
  }

  muted(v?: boolean): boolean {
    if (v != null) this.media.muted = v;
    return this.media.muted || this.volume() === 0;
  }

  toggleVolume(): void {
    if (this.muted()) {
      this.volume(this.prevVolume);
      this.muted(false);
    } else {
      this.prevVolume = this.volume();
      this.volume(0);
    }
  }
}

export default RPlayer;
