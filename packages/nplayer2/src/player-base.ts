import { getPlayerConfig } from './config';
import { EVENT } from './constants';
import { Fullscreen, WebFullscreen } from './features';
import { Contextmenu, Control, Loading } from './parts';
import { transferEvent } from './transfer-event';
import {
  ControlItem, Destroyable, MediaItem, PlayerConfig, PlayerEventTypes,
} from './types';
import {
  addDestroyable, destroy, EventEmitter, Rect,
} from './utils';
import { $, getEl } from './utils/dom';

export class PlayerBase<M extends HTMLMediaElement = HTMLMediaElement>
  extends EventEmitter<PlayerEventTypes>
  implements Destroyable {
  config: Required<PlayerConfig<M>>

  media: M;

  el: HTMLElement;

  container?: HTMLElement | null;

  mounted = false;

  rect: Rect;

  readonly current: MediaItem;

  readonly prev?: MediaItem;

  readonly next?: MediaItem;

  readonly control: Control;

  private prevVolume = 1;

  private contextmenu: Contextmenu;

  private loading: Loading;

  private fullscreen: Fullscreen;

  private webFullscreen: WebFullscreen;

  static version: string = __VERSION__;

  private static readonly controlItemMap: Record<string, ControlItem> = Object.create(null)

  constructor(config: PlayerConfig<M>) {
    super();
    config = this.config = getPlayerConfig(config);
    this.media = this.config.media;
    this.container = getEl(this.config.container);
    this.el = $('.nplayer', { tabindex: '0' }, undefined, '');
    this.el.appendChild(this.media);

    this.current = {
      src: config.src,
      title: config.title,
      poster: config.poster,
    };
    this.prev = config.prev;
    this.next = config.next;

    this.rect = addDestroyable(this, new Rect(this.el, this));
    this.fullscreen = addDestroyable(this, new Fullscreen(this));
    this.webFullscreen = addDestroyable(this, new WebFullscreen(this));

    this.control = addDestroyable(this, new Control(this.el, this));
    this.contextmenu = addDestroyable(this, new Contextmenu(this.el, this));
    this.loading = addDestroyable(this, new Loading(this.el, this));

    transferEvent(this);
  }

  get isFullscreen() {
    return this.fullscreen.isActive;
  }

  get isWebFullscreen() {
    return this.webFullscreen.isActive;
  }

  get currentTime() {
    return this.media.currentTime;
  }

  get duration() {
    return this.media.duration;
  }

  get paused() {
    return this.media.paused;
  }

  get playbackRate(): number {
    return this.media.playbackRate;
  }

  set playbackRate(v: number) {
    this.media.playbackRate = v;
  }

  get volume(): number {
    return this.media.volume;
  }

  set volume(v: number) {
    if (this.media.volume === v) return;
    this.media.volume = v;
    if (this.muted && v > 0) this.muted = false;
  }

  get muted(): boolean {
    return this.media.muted || this.volume === 0;
  }

  set muted(v: boolean) {
    this.media.muted = v;
  }

  static addControlItem(item: ControlItem) {
    if (!item || !item.id) return;
    PlayerBase.controlItemMap[item.id] = item;
  }

  static getControlItem(id: string): ControlItem | void {
    return PlayerBase.controlItemMap[id];
  }

  play() {
    this.media.play();
  }

  pause() {
    this.media.pause();
  }

  toggle() {
    if (this.paused) {
      this.play();
    } else {
      this.pause();
    }
  }

  toggleVolume() {
    if (this.muted) {
      this.volume = this.prevVolume || 1;
      this.muted = false;
    } else {
      this.prevVolume = this.volume;
      this.volume = 0;
    }
  }

  backward() {

  }

  forward() {

  }

  mount(container?: PlayerConfig<M>['container']) {
    if (this.mounted) {
      container = getEl(container) as HTMLElement;
      if (container && container !== this.container) {
        if (this.container) this.container.removeChild(this.el);
        container.appendChild(this.el);
        this.container = container;
        this.emitAsync(EVENT.REMOUNTED, this);
      }
    } else {
      if (container) this.container = getEl(container) || this.container;
      if (!this.container) return;
      this.container.appendChild(this.el);
      this.emitAsync(EVENT.MOUNTED, this);
    }
  }

  enterFullscreen() {
    return this.fullscreen.enter();
  }

  exitFullscreen() {
    return this.fullscreen.exit();
  }

  toggleFullscreen() {
    return this.fullscreen.toggle();
  }

  enterWebFullscreen() {
    return this.webFullscreen.enter();
  }

  exitWebFullscreen() {
    return this.webFullscreen.exit();
  }

  toggleWebFullscreen() {
    return this.webFullscreen.toggle();
  }

  enterPIP(): boolean {
    if ((this.media as any).requestPictureInPicture) {
      (this.media as any).requestPictureInPicture();
      return true;
    }
    return false;
  }

  exitPIP() {
    if ((document as any).exitPictureInPicture) {
      (document as any).exitPictureInPicture();
      return true;
    }
    return false;
  }

  togglePIP() {
    if ((document as any).pictureInPictureElement !== this.media) {
      this.enterPIP();
    } else {
      this.exitPIP();
    }
  }

  enterAirplay() {
    if ((this.media as any).webkitShowPlaybackTargetPicker) {
      (this.media as any).webkitShowPlaybackTargetPicker();
      return true;
    }
    return false;
  }

  addControlItem(item: ControlItem) {
    PlayerBase.addControlItem(item);
  }

  getControlItem(id: string) {
    return PlayerBase.getControlItem(id);
  }

  destroy() {
    destroy(this);
  }
}
