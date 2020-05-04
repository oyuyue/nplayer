import Component from './component';
import Controls from './controls';
import Events from './events';
import Fullscreen from './fullscreen';
import setupMediaEvents from './media-events';
import { clamp, getDomOr, isStr, newElement } from './utils';

interface RPlayerOptions {
  media?: string | HTMLVideoElement;
  el?: string | HTMLElement;
  video?: HTMLVideoElement & { src?: string | string[] };
}

class RPlayer extends Component {
  static readonly Events = Events;

  el: HTMLElement;
  media: HTMLVideoElement;

  fullscreen: Fullscreen;
  controls: Controls;

  readonly options: RPlayerOptions = {};

  private resizePending = false;
  private prevVolume = 1;
  private readonly fullscreenClass = 'rplayer-full';
  private readonly pausedClass = 'rplayer-paused';

  constructor(opts: RPlayerOptions = {}) {
    super();

    this.options = opts;

    this.init();
  }

  private init(): void {
    this.addClass('rplayer');

    this.media = getDomOr(this.options.media, () => newElement('video'));
    this.el = getDomOr(this.options.el, () => document.body);
    this.prevVolume = this.media.volume;

    if (this.options.video) this.setMediaAttrs(this.options.video);

    setupMediaEvents(this, this.media);

    this.fullscreen = new Fullscreen(this);
    this.controls = new Controls(this);

    this.initFullscreen();
    this.initClassName();
    this.initInteraction();
  }

  private initFullscreen(): void {
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

  private initClassName(): void {
    if (this.media.paused) this.addClass(this.pausedClass);

    this.on(Events.PLAY, () =>
      this.removeClass(this.pausedClass)
    ).on(Events.PAUSE, () => this.addClass(this.pausedClass));
  }

  private initInteraction(): void {
    this.dom.addEventListener('click', (ev) => {
      ev.preventDefault();
      if (this.controls.bottom.dom.contains(ev.target as any)) return;
      this.toggle();
    });

    window.addEventListener('resize', () => {
      if (this.resizePending) return;
      this.resizePending = true;
      requestAnimationFrame(this.resizeHandler);
    });
  }

  private resizeHandler = (): void => {
    this.emit(Events.RESIZE);
    this.resizePending = false;
  };

  get currentTime(): number {
    return this.media.currentTime;
  }

  get duration(): number {
    return this.media.duration;
  }

  get buffered(): TimeRanges {
    return this.media.buffered;
  }

  setMediaAttrs(map: RPlayerOptions['video']): void {
    Object.entries(map).forEach(([k, v]) => {
      if (k === 'src') {
        if (isStr(v)) {
          this.media.src = v;
        } else if (Array.isArray(v)) {
          v.forEach((s) => this.media.canPlayType(s) && (this.media.src = s));
        }
      } else {
        (this.media as any)[k] = v;
      }
    });
  }

  mount(el?: HTMLElement): this {
    if (el) this.el = el;
    this.appendChild(this.controls);
    this.emit(Events.BEFORE_MOUNT);
    this.appendChild(this.media);
    this.el.appendChild(this.dom);
    this.emit(Events.MOUNTED);
    return this;
  }

  seek(seconds: number): void {
    seconds = clamp(seconds, 0, this.duration);
    this.media.currentTime = seconds;
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
