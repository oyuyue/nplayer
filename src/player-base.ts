import { getPlayerConfig } from './config';
import { EVENT } from './constants';
import {
  Fullscreen, WebFullscreen, PlayerMediaSession, Autoplay, Disable,
} from './features';
import { Contextmenu, Control, Loading } from './parts';
import { transferEvent } from './transfer-event';
import {
  ControlItem, Destroyable, MediaInfo, MediaItem, PlayerConfig, PlayerEventTypes, Source,
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

  current!: MediaItem;

  prev?: MediaItem;

  next?: MediaItem;

  mediaSession?: PlayerMediaSession;

  readonly control: Control;

  private prevVolume = 1;

  private contextmenu: Contextmenu;

  private loading: Loading;

  private fullscreen: Fullscreen;

  private webFullscreen: WebFullscreen;

  private autoplay: Autoplay;

  private disable: Disable;

  static version: string = __VERSION__;

  private static readonly controlItemMap: Record<string, ControlItem> = Object.create(null)

  private timerChangeMedia: any;

  constructor(config: PlayerConfig<M>) {
    super();
    config = this.config = getPlayerConfig(config);
    this.media = this.config.media;
    this.container = getEl(this.config.container);
    this.el = $('.nplayer', { tabindex: '0' }, undefined, '');
    this.el.appendChild(this.media);

    this.changeMedia(config);

    this.mediaSession = PlayerMediaSession.create(this); // TODO: destroy
    this.rect = addDestroyable(this, new Rect(this.el, this));
    this.fullscreen = addDestroyable(this, new Fullscreen(this));
    this.webFullscreen = addDestroyable(this, new WebFullscreen(this));

    this.control = addDestroyable(this, new Control(this.el, this));
    this.contextmenu = addDestroyable(this, new Contextmenu(this.el, this));
    this.loading = addDestroyable(this, new Loading(this.el, this));

    transferEvent(this);

    this.autoplay = addDestroyable(this, new Autoplay(this));
    this.disable = addDestroyable(this, new Disable(this));
  }

  get readyState() {
    return this.media.readyState;
  }

  get networkState() {
    return this.media.networkState;
  }

  get isFullscreen() {
    return this.fullscreen.isActive;
  }

  get isWebFullscreen() {
    return this.webFullscreen.isActive;
  }

  get currentSrc() {
    return this.media.currentSrc;
  }

  get src() {
    return this.media.src;
  }

  set src(src: Source) {
    if (src instanceof MediaSource) {
      this.media.srcObject = src;
    } else if (Array.isArray(src)) {
      this.media.innerHTML = '';
      const frag = document.createDocumentFragment();
      src.forEach((s) => {
        const source = document.createElement('source');
        Object.keys(s).forEach((k) => {
          source.setAttribute(k, (s as any)[k]);
        });
        frag.appendChild(source);
      });
      this.media.appendChild(frag);
    } else {
      this.media.src = src;
    }
  }

  get srcObject() {
    return this.media.srcObject as (MediaSource | null);
  }

  set srcObject(ms: MediaSource | null) {
    if ('srcObject' in this.media) {
      this.media.srcObject = ms;
    } else if (ms) {
      const onOpen = () => {
        URL.revokeObjectURL(this.media.src);
        ms.removeEventListener('sourceopen', onOpen);
      };
      ms.addEventListener('sourceopen', onOpen);
      this.media.src = URL.createObjectURL(ms);
    }
  }

  get currentTime() {
    return this.media.currentTime;
  }

  set currentTime(time) {
    this.media.currentTime = time;
  }

  get seeking() {
    return this.media.seeking;
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

  get loop() {
    return this.media.loop;
  }

  set loop(loop) {
    this.media.loop = loop;
  }

  get ended() {
    return this.media.ended;
  }

  get error() {
    return this.media.error;
  }

  static addControlItem(item: ControlItem) {
    if (!item || !item.id) return;
    PlayerBase.controlItemMap[item.id] = item;
  }

  static getControlItem(id: string): ControlItem | void {
    return PlayerBase.controlItemMap[id];
  }

  load() {
    if (!this.srcObject && this.currentSrc && !this.currentSrc.startsWith('blob')) {
      this.media.load();
      return true;
    }
    return false;
  }

  play(): Promise<void> {
    return Promise.resolve(this.media.play());
  }

  pause() {
    this.media.pause();
  }

  stop() {
    if (!this.current.live) {
      this.currentTime = 0;
    }
    this.pause();
  }

  toggle() {
    if (this.paused) {
      this.play();
    } else {
      this.pause();
    }
  }

  fastSeek(time: number) {
    if (this.media.fastSeek) {
      this.media.fastSeek(time);
    } else {
      this.currentTime = time;
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

  incVolume(v = this.config.volumeStep) {
    this.volume += v;
  }

  decVolume(v = this.config.volumeStep) {
    this.volume -= v;
  }

  backward(time = this.config.seekStep) {
    this.currentTime -= time;
  }

  forward(time = this.config.seekStep) {
    this.currentTime += time;
  }

  changeMedia(info: MediaInfo) {
    this.current = {
      src: info.src,
      title: info.title,
      poster: info.poster,
      live: info.live,
      duration: info.duration,
      startPlayTime: info.startPlayTime,
    };
    this.prev = info.prev;
    this.next = info.next;
    clearTimeout(this.timerChangeMedia);
    this.timerChangeMedia = setTimeout(() => {
      this.emit(EVENT.MEDIA_CHANGED, info);
      this.autoplay.setup();
      if (this.current.startPlayTime) {
        this.once(EVENT.LOADEDMETADATA, () => {
          if (this.current.startPlayTime) this.fastSeek(this.current.startPlayTime);
        });
      }
    });
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

  getVideoPlaybackQuality() {

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

  disableSeek() {
    this.disable.disableSeek();
  }

  enableSeek() {
    this.disable.enableSeek();
  }

  disablePlay() {
    this.disable.disablePlay();
  }

  enablePlay() {
    this.disable.enablePlay();
  }

  destroy() {
    destroy(this);
  }
}
