import { Disposable, PlayerOptions } from './types';
import { processOptions } from './options';
import {
  $, addClass, getEl, Rect, EventEmitter, clamp, isString,
  dispose, removeNode, addDisposable, isBrowser,
} from './utils';
import { Control, ControlItem } from './parts/control';
import { Loading } from './parts/loading';
import { ContextMenu, ContextMenuItem } from './parts/contextmenu';
import { Toast } from './parts/toast';
import { Fullscreen } from './features/fullscreen';
import { WebFullscreen } from './features/web-fullscreen';
import {
  setCssVariables, setVideoAttrs, transferEvent, tryOpenEdge,
  setVideoVolumeFromLocal, registerNamedMap, setVideoSources, saveVideoVolume,
} from './helper';
import { EVENT } from './constants';
import { Shortcut } from './features/shortcut';
import { SettingItem } from './parts/control/items/setting';

import * as _utils from './utils';
import * as components from './components';
import { I18n, Icon } from './features';
import { Poster } from './parts/poster';

export class Player extends EventEmitter implements Disposable {
  el: HTMLElement | null;

  element: HTMLElement;

  opts: Required<PlayerOptions>;

  mounted = false;

  private prevVolume = 1;

  private readonly settingNamedMap: Record<string, SettingItem> = Object.create(null);

  private readonly contextmenuNamedMap: Record<string, ContextMenuItem> = Object.create(null);

  private readonly controlNamedMap: Record<string, ControlItem> = Object.create(null);

  readonly _settingItems: SettingItem[];

  readonly video: HTMLVideoElement;

  readonly rect: Rect;

  readonly fullscreen: Fullscreen;

  readonly webFullscreen: WebFullscreen;

  readonly shortcut: Shortcut;

  readonly control: Control;

  readonly loading: Loading;

  readonly poster: Poster;

  readonly contextmenu: ContextMenu;

  readonly toast: Toast;

  constructor(opts?: PlayerOptions) {
    super();
    this.opts = processOptions(opts);
    tryOpenEdge(this);
    this.el = getEl(this.opts.el);
    this.element = $('.nplayer', { tabindex: '0' }, undefined, '');
    if (this.opts.video) {
      this.video = this.opts.video;
      addClass(this.video, 'video');
    } else {
      this.video = $('video.video');
    }

    if (this.opts.src) this.opts.videoAttrs.src = this.opts.src;
    setCssVariables(this.element, this.opts);
    setVideoAttrs(this.video, this.opts.videoAttrs);
    setVideoSources(this.video, this.opts.videoSources);
    setVideoVolumeFromLocal(this.video);
    transferEvent(this);
    if (this.opts.clickPause) this.enableClickPause();
    this.element.appendChild(this.video);

    registerNamedMap(this);

    this.rect = addDisposable(this, new Rect(this.element, this));
    this.fullscreen = addDisposable(this, new Fullscreen(this));
    this.webFullscreen = addDisposable(this, new WebFullscreen(this));
    this.shortcut = addDisposable(this, new Shortcut(this, this.opts.shortcut));
    this.toast = addDisposable(this, new Toast(this.element));
    this.loading = addDisposable(this, new Loading(this.element, this));
    this.poster = addDisposable(this, new Poster(this.element, this));

    if (this.opts.plugins) {
      this.opts.plugins.forEach((plugin) => {
        if (plugin.dispose) {
          addDisposable(this, plugin as Disposable);
        }
        plugin.apply(this);
      });
    }

    this.contextmenu = addDisposable(this, new ContextMenu(this.element, this, this.opts.contextMenus.map((item) => {
      if (isString(item)) return this.contextmenuNamedMap[item];
      return item;
    }).filter(Boolean)));

    this._settingItems = this.opts.settings.map((item) => {
      if (isString(item)) return this.settingNamedMap[item];
      return item;
    }).filter(Boolean);

    this.control = addDisposable(this, new Control(this.element, this));

    addDisposable(this, this.on(EVENT.LOADED_METADATA, () => {
      const time = this.opts.autoSeekTime || 0.3;
      if (this.currentTime < time) this.currentTime = time;
      this.opts.autoSeekTime = 0;
    }));

    this.emit(EVENT.AFTER_INIT);
  }

  get currentTime(): number {
    return this.video.currentTime;
  }

  set currentTime(v: number) {
    if (!this.duration) return;
    const diff = v - this.video.currentTime;
    if (!diff) return;
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
    saveVideoVolume(this.video.volume);
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

  enableClickPause() {
    this.video.addEventListener('click', this.toggle);
  }

  disableClickPause() {
    this.video.removeEventListener('click', this.toggle);
  }

  mount(el?: PlayerOptions['el']): void {
    if (this.mounted) {
      el = getEl(el) as any;
      if (el && el !== this.el) {
        if (this.el) this.el.removeChild(this.element);
        this.el = el as HTMLElement;
        this.el.appendChild(this.element);
        this.emit(EVENT.UPDATE_SIZE);
      }
      return;
    }
    if (el) this.el = getEl(el) || this.el;
    if (!this.el) return;
    this.el.appendChild(this.element);
    this.emit(EVENT.MOUNTED);
    this.mounted = true;
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

  play(): Promise<void> | void {
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

  getSettingItem(id: string): SettingItem | undefined {
    return this.settingNamedMap[id];
  }

  getContextMenuItem(id: string): ContextMenuItem | undefined {
    return this.contextmenuNamedMap[id];
  }

  getControlItem(id: string): ControlItem | undefined {
    return this.controlNamedMap[id] as ControlItem;
  }

  updateOptions(opts: PlayerOptions): void {
    if (opts.videoAttrs !== this.opts.videoAttrs) setVideoAttrs(this.video, opts.videoAttrs);
    if (opts.src && opts.src !== this.opts.src) this.video.src = opts.src;
    if (opts.videoSources !== this.opts.videoSources) setVideoAttrs(this.video, opts.videoAttrs);
    this.opts = { ...this.opts, ...opts };
    setCssVariables(this.element, this.opts);
    if (this.opts.shortcut) {
      this.shortcut.enable();
    } else {
      this.shortcut.disable();
    }
    this.disableClickPause();
    if (this.opts.clickPause) this.enableClickPause();
    this.emit(EVENT.UPDATE_OPTIONS, this.opts);
  }

  dispose(): void {
    if (!this.element) return;
    this.emit(EVENT.BEFORE_DISPOSE);
    dispose(this);
    const plugins = this.opts.plugins;
    if (plugins) plugins.forEach((p) => p.dispose && p.dispose());
    this.removeAllListeners();
    removeNode(this.element);
    this.element = null!;
    this.el = null;
  }

  static _utils = _utils;

  static EVENT = EVENT;

  static I18n = I18n;

  static Icon = Icon;

  static components = components;

  static Player = Player;

  Player!: typeof Player;

  EVENT!: typeof EVENT;
}

Player.prototype.Player = Player;
Player.prototype.EVENT = EVENT;

if (isBrowser) {
  // eslint-disable-next-line no-console
  console.log(
    `%c NPlayer %c v${__VERSION__} %c https://github.com/woopen/nplayer `,
    'padding: 1px; border-radius: 3px 0 0 3px; color: #fff; background: #606060;',
    'padding: 1px; color: #fff; background: #1475b2;',
    'padding: 1px; border-radius: 0 3px 3px 0; color: #fff; background: #42c02e;',
  );
}
