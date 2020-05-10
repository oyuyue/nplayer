import Component from './component';
import { BP } from './config';
import Controls from './controls';
import Events from './events';
import Fullscreen from './fullscreen';
import I18n from './i18n';
import Loading from './loading';
import setupMediaEvents from './media-events';
import processOptions, { RPlayerOptions } from './options';
import Respond from './respond';
import Shortcut from './shortcut';
import { clamp, getDomOr, isCatchable, isStr, newElement, noop } from './utils';

class RPlayer extends Component {
  el: HTMLElement;
  curBreakPoint: string;
  readonly media: HTMLVideoElement;
  readonly options: RPlayerOptions;

  readonly fullscreen: Fullscreen;
  readonly controls: Controls;
  readonly shortcut: Shortcut;
  readonly i18n: I18n;
  readonly loading: Loading;
  readonly respond: Respond;

  private prevVolume = 1;

  constructor(opts: RPlayerOptions) {
    super();

    this.options = processOptions(this, opts);

    this.addClass('rplayer');
    this.canFocus();

    this.i18n = new I18n(this.options);
    this.media = getDomOr(this.options.media, () => newElement('video'));
    this.el = getDomOr(this.options.el, document.body);

    this.prevVolume = this.media.volume;
    if (this.options.video) this.setMediaAttrs(this.options.video);
    setupMediaEvents(this, this.media);

    this.fullscreen = new Fullscreen(this);
    this.controls = new Controls(this);
    this.shortcut = new Shortcut(this);
    this.loading = new Loading(this);
    this.respond = new Respond(this);
  }

  get currentTime(): number {
    return this.media.currentTime;
  }

  set currentTime(v: number) {
    if (!this.duration) return;
    this.media.currentTime = clamp(v, 0, this.duration);
    this.emit(Events.TIME_UPDATE);
  }

  get volume(): number {
    return this.media.volume;
  }

  set volume(v: number) {
    this.media.volume = clamp(v);
    if (this.muted && v > 0) this.muted = false;
  }

  get muted(): boolean {
    return this.media.muted || this.volume === 0;
  }

  set muted(v: boolean) {
    this.media.muted = v;
  }

  get playbackRate(): number {
    return this.media.playbackRate;
  }

  set playbackRate(v: number) {
    this.media.playbackRate = v;
  }

  get duration(): number {
    return this.media.duration || 0;
  }

  get buffered(): TimeRanges {
    return this.media.buffered;
  }

  get paused(): boolean {
    return this.media.paused;
  }

  get isPhone(): boolean {
    return this.curBreakPoint === BP.BREAKPOINT_PHONE;
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
    requestAnimationFrame(() => this.emit(Events.MOUNTED));
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

  incVolume(v = 0.1): void {
    this.volume += v;
  }

  decVolume(v = 0.1): void {
    this.volume -= v;
  }

  forward(v = 10): void {
    this.currentTime += v;
  }

  rewind(v = 10): void {
    this.currentTime -= v;
  }

  toggleVolume(): void {
    if (this.muted) {
      this.volume = this.prevVolume;
      this.muted = false;
    } else {
      this.prevVolume = this.volume;
      this.volume = 0;
    }
  }

  t(key: string): string {
    return this.i18n.t(key);
  }
}

export default RPlayer;
