import { PlayerOptions } from './types';
import { processOptions } from './options';
import {
  $, addClass, getEl, Rect, EventEmitter, clamp,
} from './utils';
import { Control } from './parts/control';
import { Loading } from './parts/loading';
import { Contextmenu } from './parts/contextmenu';
import { Toast } from './parts/toast';
import { Dialog } from './parts/dialog';
import { Fullscreen } from './features/fullscreen';
import { WebFullscreen } from './features/web-fullscreen';
import { transferVideoEvent } from './helper';
import { EVENT } from './constants';

export class Player extends EventEmitter {
  private el: HTMLElement | null;

  private prevVolume = 1;

  readonly element: HTMLElement;

  readonly video: HTMLVideoElement;

  private opts: PlayerOptions;

  readonly rect: Rect;

  readonly fullscreen: Fullscreen;

  readonly webFullscreen: WebFullscreen;

  readonly control: Control;

  readonly contextmenu: Contextmenu;

  readonly toast: Toast;

  readonly dialog: Dialog;

  constructor(opts: PlayerOptions) {
    super();
    this.opts = processOptions(opts);
    this.el = getEl(this.opts.el);
    this.element = $('.rplayer', undefined, undefined, '');
    if (this.opts.video) {
      this.video = this.opts.video;
      addClass(this.video, 'video');
    } else {
      this.video = $('video.video', { src: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4' });
    }
    this.element.appendChild(this.video);

    this.prevVolume = this.video.volume;
    this.volume = this.prevVolume;

    transferVideoEvent(this);

    this.rect = new Rect(this.element);
    this.fullscreen = new Fullscreen(this);
    this.webFullscreen = new WebFullscreen(this);

    this.control = new Control(this.element, this);
    new Loading(this.element, this);
    this.contextmenu = new Contextmenu(this.element, this, [{ html: 'asdasd' }]);
    this.dialog = new Dialog();
    this.toast = new Toast(this.element);
  }

  get currentTime(): number {
    return this.video.currentTime;
  }

  set currentTime(v: number) {
    if (!this.duration) return;
    this.video.currentTime = clamp(v, 0, this.duration);
    this.emit(EVENT.TIME_UPDATE);
  }

  get duration(): number {
    return this.video.duration || 0;
  }

  get buffered(): TimeRanges {
    return this.video.buffered;
  }

  get volume(): number {
    return this.video.volume;
  }

  set volume(v: number) {
    this.video.volume = clamp(v);
    if (this.muted && v > 0) this.muted = false;
  }

  get muted(): boolean {
    return this.video.muted || this.volume === 0;
  }

  set muted(v: boolean) {
    this.video.muted = v;
  }

  get ended(): boolean {
    return this.video.ended;
  }

  get paused(): boolean {
    return this.video.paused;
  }

  get playing(): boolean {
    return !this.paused && !this.ended;
  }

  mount(el?: PlayerOptions['el']): void {
    if (el) this.el = getEl(el) || this.el;
    if (!this.el) throw new Error('require `el` option');
    this.el.appendChild(this.element);
  }

  play(): Promise<void> {
    return this.video.play();
  }

  pause(): void {
    this.video.pause();
  }

  seek(seconds: number): void {
    this.video.currentTime = clamp(seconds, 0, this.duration);
  }

  toggle = () => {
    if (this.paused) {
      this.play();
    } else {
      this.pause();
    }
  }

  toggleVolume(): void {
    if (this.muted) {
      this.volume = this.prevVolume || 1;
      this.muted = false;
    } else {
      this.prevVolume = this.volume;
      this.volume = 0;
    }
  }

  eachBuffer(fn: (start: number, end: number) => boolean | void): void {
    for (let l = this.buffered.length, i = l - 1; i >= 0; i--) {
      if (fn(this.buffered.start(i), this.buffered.end(i))) {
        break;
      }
    }
  }
}
