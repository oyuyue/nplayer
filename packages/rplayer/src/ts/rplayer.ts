import EventEmitter from 'eventemitter3';
import Component from './component';
import { BP } from './config';
import { PLAYER } from './config/classname';
import Controls from './controls';
import Events from './events';
import setupEvents from './handle-events';
import Loading from './loading';
import processOptions, { RPlayerOptions, Plugin } from './options';
import Subtitle from './plugins/subtitle';
import Fullscreen from './plugins/fullscreen';
import Shortcut from './shortcut';
import Storage from './storage';
import { clamp, getDomOr, isCatchable, isStr, newElement, noop } from './utils';
import * as utils from './utils';
import icons from './icons';
import language from './config/lang';
import Switch from './widgets/switch';
import Slider from './widgets/slider';
import Checkbox from './widgets/checkbox';
import Tray from './widgets/tray';
import Popover from './widgets/popover';
import BaseItem from './controls/setting/base-item';
import SwitchItem from './controls/setting/switch-item';
import Select from './controls/setting/select';
import Toast from './toast';

export default class RPlayer extends Component {
  static readonly Events = Events;
  static readonly utils = utils;
  static readonly icons = icons;
  static readonly EventEmitter = EventEmitter;
  static readonly Switch = Switch;
  static readonly Slider = Slider;
  static readonly Checkbox = Checkbox;
  static readonly Tray = Tray;
  static readonly Popover = Popover;
  static readonly SettingBase = BaseItem;
  static readonly SettingSwitch = SwitchItem;
  static readonly SettingSelect = Select;

  el: HTMLElement;
  curBreakPoint: string;
  readonly media: HTMLVideoElement;
  readonly options: RPlayerOptions;

  readonly fullscreen: Fullscreen;
  readonly controls: Controls;
  readonly shortcut: Shortcut;
  readonly loading: Loading;
  readonly subtitle: Subtitle;
  readonly $toast: Toast;
  storage: Storage;

  private prevVolume = 1;
  private ready = false;

  constructor(opts: RPlayerOptions) {
    super();

    this.options = processOptions(this, opts);

    this.addClass(PLAYER);
    this.canFocus();

    this.media = getDomOr(this.options.media, () => newElement('', 'video'));
    this.el = getDomOr(this.options.el, document.body);

    this.restore();
    if (this.options.video) this.setMediaAttrs(this.options.video);
    setupEvents(this, this.media);
    this.prevVolume = this.media.volume;
    this.volume = this.prevVolume;
    this.autoUpdateRect(this);

    this.controls = new Controls(this);
    this.shortcut = new Shortcut(this);
    this.loading = new Loading(this);
    this.fullscreen = new Fullscreen(this);
    this.subtitle = new Subtitle(this);
    this.$toast = new Toast(this);

    this.options.plugins.forEach((p) => p.install(this));
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
    this.storage.set({ volume: this.media.volume });
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

  get ended(): boolean {
    return this.media.ended;
  }

  get playing(): boolean {
    return this.ready && !this.paused && !this.ended;
  }

  get isPhone(): boolean {
    return this.curBreakPoint === BP.BREAKPOINT_PHONE;
  }

  private restore(): void {
    this.media.volume = this.storage.get('volume', 1);
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
    this.appendChild(this.media);
    this.appendChild(this.controls);
    this.emit(Events.BEFORE_MOUNT);
    this.el.appendChild(this.dom);
    requestAnimationFrame(() => {
      this.emit(Events.MOUNTED);
      this.ready = true;
    });
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
      this.volume = this.prevVolume || 1;
      this.muted = false;
    } else {
      this.prevVolume = this.volume;
      this.volume = 0;
    }
  }

  toast(v: Parameters<Toast['show']>[0]): void {
    this.$toast.show(v);
  }

  hideToast(): void {
    this.$toast.hide();
  }

  t(key: string): string {
    return language.t(key, this.options.lang);
  }

  eachBuffer(fn: (start: number, end: number) => boolean | void): void {
    for (let l = this.buffered.length, i = l - 1; i >= 0; i--) {
      if (fn(this.buffered.start(i), this.buffered.end(i))) {
        break;
      }
    }
  }

  use(plugin: Plugin): void {
    plugin.install(this);
  }

  addLang(lang: string, data: Record<string, string>): void {
    language.addLang(lang, data);
  }
}
