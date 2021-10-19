import { Disposable, PlayerOptions, Plugin } from './types';
import { processOptions } from './options';
import {
  $, addClass, getEl, Rect, EventEmitter, clamp, isString,
  dispose, removeNode, addDisposable, patchProps, internalUtils,
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

import * as components from './components';
import { I18n, Icon } from './features';
import { Poster } from './parts/poster';
import { Touch } from './features/touch';

export class Player extends EventEmitter implements Disposable {
  container: HTMLElement | null;

  el: HTMLElement;

  opts: Required<PlayerOptions>;

  mounted = false;

  private prevVolume = 1;

  private readonly settingNamedMap: Record<string, SettingItem> = Object.create(null);

  private readonly contextmenuNamedMap: Record<string, ContextMenuItem> = Object.create(null);

  private readonly controlNamedMap: Record<string, ControlItem> = Object.create(null);

  readonly __settingItems: SettingItem[];

  readonly video: HTMLVideoElement;

  readonly rect: Rect;

  readonly fullscreen: Fullscreen;

  readonly webFullscreen: WebFullscreen;

  readonly shortcut: Shortcut;

  readonly touch: Touch;

  readonly control: Control;

  readonly loading: Loading;

  readonly poster: Poster;

  readonly contextmenu: ContextMenu;

  readonly toast: Toast;

  private readonly plugins: Set<Plugin> = new Set();

  constructor(opts?: PlayerOptions) {
    super();
    this.opts = processOptions(opts);
    tryOpenEdge(this);
    I18n.setCurrentLang(this.opts.i18n);
    this.container = getEl(this.opts.container);
    this.el = $('.nplayer', { tabindex: '0' }, undefined, '');
    if (this.opts.video) {
      this.video = this.opts.video;
      addClass(this.video, 'video');
    } else {
      this.video = $('video.video');
    }

    if (this.opts.src) this.opts.videoProps.src = this.opts.src;
    setCssVariables(this.el, this.opts);
    setVideoAttrs(this.video, this.opts.videoProps);
    setVideoSources(this.video, this.opts.videoSources);
    setVideoVolumeFromLocal(this.video);
    transferEvent(this);
    this.el.appendChild(this.video);

    registerNamedMap(this);

    this.rect = addDisposable(this, new Rect(this.el, this));
    this.fullscreen = addDisposable(this, new Fullscreen(this));
    this.webFullscreen = addDisposable(this, new WebFullscreen(this));
    this.shortcut = addDisposable(this, new Shortcut(this, this.opts.shortcut));
    this.touch = addDisposable(this, new Touch(this));
    this.toast = addDisposable(this, new Toast(this.el));
    this.loading = addDisposable(this, new Loading(this.el, this));
    this.poster = addDisposable(this, new Poster(this.el, this));

    if (this.opts.plugins) {
      this.opts.plugins.forEach((plugin) => this.use(plugin));
    }

    this.contextmenu = addDisposable(this, new ContextMenu(this.el, this, this.opts.contextMenus.map((item) => {
      if (isString(item)) return this.contextmenuNamedMap[item];
      return item;
    }).filter(Boolean)));

    this.__settingItems = this.opts.settings.map((item) => {
      if (isString(item)) return this.settingNamedMap[item];
      return item;
    }).filter(Boolean);

    this.control = addDisposable(this, new Control(this.el, this));

    addDisposable(this, this.on(EVENT.CANPLAY, () => {
      const time = this.opts.autoSeekTime || 0.3;
      if (this.currentTime < time) {
        this.currentTime = time;

        /**
         * @see https://stackoverflow.com/questions/18266437/html5-video-currenttime-not-setting-properly-on-iphone
         */
        if (this.currentTime < time) {
          this.video.load();
          this.video.pause();
        }
      }
      this.opts.autoSeekTime = 0;
    }));

    if (!this.opts.isTouch) {
      this.enableClickPause();
    }

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
  }

  get loaded(): boolean {
    return this.video.readyState >= 3;
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

  use(plugin: Plugin): this {
    if (!plugin || this.plugins.has(plugin)) return this;
    if (plugin.dispose) {
      addDisposable(this, plugin as Disposable);
    }
    plugin.apply(this);
    return this;
  }

  mount(el?: PlayerOptions['container']): void {
    if (this.mounted) {
      el = getEl(el) as any;
      if (el && el !== this.container) {
        if (this.container) this.container.removeChild(this.el);
        this.container = el as HTMLElement;
        this.container.appendChild(this.el);
        this.emit(EVENT.UPDATE_SIZE);
      }
      return;
    }
    if (el) this.container = getEl(el) || this.container;
    if (!this.container) return;
    this.container.appendChild(this.el);
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
    if (opts.videoProps !== this.opts.videoProps) patchProps(this.video, this.opts.videoProps, opts.videoProps);
    if (opts.src && opts.src !== this.opts.src) this.video.src = opts.src;
    if (opts.videoSources !== this.opts.videoSources) setVideoSources(this.video, opts.videoSources);
    this.opts = { ...this.opts, ...opts };
    setCssVariables(this.el, this.opts);
    if (this.opts.shortcut) {
      this.shortcut.enable();
    } else {
      this.shortcut.disable();
    }
    this.emit(EVENT.UPDATE_OPTIONS, this.opts);
  }

  updateControlItems(items: Parameters<Control['updateItems']>[0], index?: number): void {
    this.control.updateItems(items, index);
  }

  dispose(): void {
    if (!this.el) return;
    this.emit(EVENT.BEFORE_DISPOSE);
    dispose(this);
    const plugins = this.opts.plugins;
    if (plugins) plugins.forEach((p) => p.dispose && p.dispose());
    this.removeAllListeners();
    removeNode(this.el);
    this.el = null!;
    this.container = null;
  }

  static __utils = internalUtils;

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
