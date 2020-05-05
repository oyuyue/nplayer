import Component from './component';
import Controls from './controls';
import Events from './events';
import Fullscreen from './fullscreen';
import setupMediaEvents from './media-events';
import processOptions, { RPlayerOptions } from './options';
import { clamp, getDomOr, isCatchable, isStr, newElement, noop } from './utils';

class RPlayer extends Component {
  static readonly Events = Events;

  el: HTMLElement;
  readonly media: HTMLVideoElement;

  readonly fullscreen: Fullscreen;
  readonly controls: Controls;

  readonly options: RPlayerOptions;

  private resizePending = false;
  private prevVolume = 1;
  private readonly fullscreenClass = 'rplayer-full';
  private readonly pausedClass = 'rplayer-paused';

  constructor(opts: RPlayerOptions) {
    super();

    this.options = processOptions(this, opts);

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
    if (this.paused) this.addClass(this.pausedClass);

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

  get paused(): boolean {
    return this.media.paused;
  }

  setMediaAttrs(map: RPlayerOptions['video']): void {
    Object.keys(map).forEach((k) => {
      const v = (map as any)[k];
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

  mount(el?: HTMLElement): void {
    if (el) this.el = el;
    this.appendChild(this.controls);
    this.emit(Events.BEFORE_MOUNT);
    this.appendChild(this.media);
    this.el.appendChild(this.dom);
    this.emit(Events.MOUNTED);
  }

  seek(seconds: number): void {
    this.media.currentTime = clamp(seconds, 0, this.duration);
  }

  play(): void {
    const p = this.media.play();
    if (isCatchable(p)) p.catch(noop);
  }

  pause(): void {
    this.media.pause();
  }

  toggle(): void {
    if (this.paused) {
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

  playbackRate(rate: number): number {
    if (rate != null) this.media.playbackRate = rate;
    return this.media.playbackRate;
  }
}

export default RPlayer;
