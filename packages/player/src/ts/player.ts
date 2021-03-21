import { Disposable, PlayerOptions } from './types';
import { processOptions } from './options';
import {
  $, addClass, getEl, Rect, EventEmitter, clamp, isString,
} from './utils';
import { Control, ControlItem } from './parts/control';
import { Loading } from './parts/loading';
import { ContextMenu, ContextMenuItem } from './parts/contextmenu';
import { Toast } from './parts/toast';
import { Dialog } from './parts/dialog';
import { Fullscreen } from './features/fullscreen';
import { WebFullscreen } from './features/web-fullscreen';
import { transferVideoEvent } from './helper';
import { EVENT } from './constants';
import { Shortcut } from './features/shortcut';
import { SettingControlItem, SettingItem } from './parts/control/items/setting';
import { speedSettingItem } from './setting-items/speed';
import { PlayControlItem } from './parts/control/items/play';
import { VolumeControlItem } from './parts/control/items/volume';
import { TimeControlItem } from './parts/control/items/time';
import { SpacerControlItem } from './parts/control/items/spacer';
import { WebFullscreenControlItem } from './parts/control/items/web-fullscreen';
import { FullscreenControlItem } from './parts/control/items/fullscreen';
import { loopContextMenuItem } from './contextmenu-items/loop';
import { PipContextMenuItem } from './contextmenu-items/pip';
import { versionContextMenuItem } from './contextmenu-items/version';

import * as _utils from './utils';
import * as _components from './components';

export class Player extends EventEmitter implements Disposable {
  private el: HTMLElement | null;

  private prevVolume = 1;

  readonly settingNamedMap: Record<string, SettingItem> = Object.create(null);

  readonly contextmenuNamedMap: Record<string, ContextMenuItem> = Object.create(null);

  readonly controlNamedMap: Record<string, ControlItem> = Object.create(null);

  readonly _settingItems: SettingItem[];

  readonly element: HTMLElement;

  readonly video: HTMLVideoElement;

  readonly opts: Required<PlayerOptions>;

  readonly rect: Rect;

  readonly fullscreen: Fullscreen;

  readonly webFullscreen: WebFullscreen;

  readonly shortcut: Shortcut;

  readonly control: Control;

  readonly contextmenu: ContextMenu;

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
      this.video = $('video.video');
    }

    this.setVideoOptions(this.opts.videoOptions);

    this.registerNamedMap();

    this.element.appendChild(this.video);
    this.setVideoVolumeFromLocal();
    transferVideoEvent(this);

    this.rect = new Rect(this.element);
    this.fullscreen = new Fullscreen(this);
    this.webFullscreen = new WebFullscreen(this);
    this.shortcut = new Shortcut(this, this.opts.shortcut);

    new Loading(this.element, this);
    this.dialog = new Dialog();
    this.toast = new Toast(this.element);

    if (this.opts.plugins) {
      this.opts.plugins.forEach((plugin) => plugin.apply(this));
    }

    this.contextmenu = new ContextMenu(this.element, this, this.opts.contextMenus.map((item) => {
      if (isString(item)) return this.contextmenuNamedMap[item];
      return item;
    }).filter(Boolean));

    this._settingItems = this.opts.settings.map((item) => {
      if (isString(item)) return this.settingNamedMap[item];
      return item;
    }).filter(Boolean);

    this.control = new Control(this.element, this);
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
    localStorage.setItem('rplayer:volume', String(this.video.volume));
  }

  get muted(): boolean {
    return this.video.muted || this.volume === 0;
  }

  set muted(v: boolean) {
    this.video.muted = v;
  }

  get playbackRate(): number {
    return this.video.playbackRate;
  }

  set playbackRate(v: number) {
    this.video.playbackRate = v;
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

  get loop(): boolean {
    return this.video.loop;
  }

  set loop(v: boolean) {
    this.video.loop = v;
  }

  private setVideoVolumeFromLocal(): void {
    const volume = parseFloat(localStorage.getItem('rplayer:volume') as string);

    // eslint-disable-next-line no-restricted-globals
    if (!isNaN(volume)) {
      this.video.volume = volume;
    }
  }

  private setVideoOptions(options?: Record<string, any>): void {
    if (!options) return;
    Object.keys(options).forEach((k) => {
      (this.video as any)[k] = options[k];
    });
  }

  private registerNamedMap(): void {
    this.registerContextMenuItem(loopContextMenuItem);
    this.registerContextMenuItem(PipContextMenuItem);
    this.registerContextMenuItem(versionContextMenuItem);
    this.registerSettingItem(speedSettingItem);
    this.registerControlItem(PlayControlItem);
    this.registerControlItem(VolumeControlItem);
    this.registerControlItem(TimeControlItem);
    this.registerControlItem(SpacerControlItem);
    this.registerControlItem(SettingControlItem);
    this.registerControlItem(WebFullscreenControlItem);
    this.registerControlItem(FullscreenControlItem);
  }

  mount(el?: PlayerOptions['el']): void {
    if (el) this.el = getEl(el) || this.el;
    if (!this.el) throw new Error('require `el` option');
    this.el.appendChild(this.element);

    this.emit(EVENT.MOUNTED);
  }

  incVolume(v = this.opts.volumeStep): void {
    this.volume += v;
  }

  decVolume(v = this.opts.volumeStep): void {
    this.volume -= v;
  }

  forward(v = this.opts.seekStep): void {
    this.currentTime += v;
  }

  rewind(v = this.opts.seekStep): void {
    this.currentTime -= v;
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

  registerSettingItem(item: SettingItem, id?: string): void {
    this.settingNamedMap[id || item.id!] = item;
  }

  registerContextMenuItem(item: ContextMenuItem, id?: string): void {
    this.contextmenuNamedMap[id || item.id!] = item;
  }

  registerControlItem(item: ControlItem, id?: string): void {
    this.controlNamedMap[id || item.id!] = item;
  }

  dispose(): void {}

  static EVENT = EVENT;

  static _utils = _utils;

  static _components = _components;

  Player!: typeof Player;
}

Player.prototype.Player = Player;
