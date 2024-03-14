import { getConfig, type MediaInfo, type PlayerConfig } from './config';
import type { Source } from './type'
import { transferEvent, type PlayerEvents, Events, MediaInfoEvent } from './event';
import { EventEmitter } from './event-emitter';
import { Fullscreen } from './features/fullscreen';
import { Hotkey } from './features/hotkey';
import { PlayerMediaSession } from './features/media-session';
import { WebFullscreen } from './features/web-fullscreen';
import { isString } from './utils';
import { CanvasVideo } from './features/canvas';

export class Player extends EventEmitter<PlayerEvents> {
  readonly el = document.createElement('div');

  readonly media: HTMLMediaElement;

  readonly config: PlayerConfig;

  private prevVolume = 1;

  private fullscreen: Fullscreen;

  private webFullscreen: WebFullscreen;

  private hotkey: Hotkey;

  private mediaSession?: PlayerMediaSession;

  private canvasVideo?: CanvasVideo;

  private destroyFns: (() => void)[] = [];

  constructor(config?: PlayerConfig) {
    super()
    this.config = getConfig(config);
    this.el = document.createElement('div');
    this.media = this.config.media || document.createElement('video')
    this.el.appendChild(this.media)

    this.fullscreen = new Fullscreen(this);
    this.webFullscreen = new WebFullscreen(this);
    this.hotkey = new Hotkey(this);
    this.mediaSession = PlayerMediaSession.create(this);

    this.media.controls = false;

    // this.media.src = 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'

    this.destroyFns.push(transferEvent(this))

    const cfg = this.config;


    this.media.crossOrigin = '';
  }

  updateConfig(cfg: PlayerConfig) {
    const { media } = this
    if (cfg.volume != null) this.volume = cfg.volume;
    if (cfg.muted != null) this.muted = cfg.muted;
    if (cfg.speed != null) this.speed = cfg.speed;
    if (cfg.loop != null) media.loop = cfg.loop;
    if (cfg.crossOrigin != null) media.crossOrigin = cfg.crossOrigin;
    if (cfg.preload != null) media.preload = cfg.preload;

    if (cfg.disablePictureInPicture != null) {
      (media as HTMLVideoElement).disablePictureInPicture = cfg.disablePictureInPicture;
    }
    if (cfg.disableRemotePlayback != null) {
      media.disableRemotePlayback = cfg.disableRemotePlayback;
    }
    if (cfg.playsInline != null) {
      const str = String(cfg.playsInline);
      media.setAttribute('playsinline', str);
      media.setAttribute('x5-playsinline', str);
      media.setAttribute('webkit-playsinline', str);
    }

    if (cfg.src != null) this.src = cfg.src;
    if (cfg.poster) {
      
    }
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

  set src(src: Source | undefined) {
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
    } else if (src) {
      this.media.src = src;
    } else {
      this.media.src = '';
      this.media.srcObject = null;
    }
  }

  get srcObject() {
    return this.media.srcObject as (MediaSource | null);
  }

  set srcObject(ms: MediaSource | null) {
    const { media } = this
    if ('srcObject' in media) {
      media.srcObject = ms;
    } else if (ms) {
      const onOpen = () => {
        URL.revokeObjectURL((media as HTMLMediaElement).src);
        ms.removeEventListener('sourceopen', onOpen);
      };
      ms.addEventListener('sourceopen', onOpen);
      (media as HTMLMediaElement).src = URL.createObjectURL(ms);
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

  get speed() {
    return this.media.playbackRate;
  }

  set speed(v: number) {
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

  load() {
    if (!this.srcObject && this.currentSrc && !this.currentSrc.startsWith('blob')) {
      this.media.load();
      return true;
    }
    return false;
  }

  // promise
  changeSource() {

  }

  changeMediaInfo(info: MediaInfo) {
    const { src, ...other } = info
    this.src = src;
    Object.assign(this.config, other)
    this.emit(Events.mediaInfoChange, new MediaInfoEvent(this, info))
  }

  // promise
  seek(time: number) {
    if (this.media.fastSeek) {
      this.media.fastSeek(time);
    } else {
      this.currentTime = time;
    }
  }

  play(): Promise<void> {
    return Promise.resolve(this.media.play());
  }

  pause() {
    this.media.pause();
  }

  stop() {
    this.currentTime = 0;
    this.pause();
  }

  toggle() {
    if (this.paused) {
      this.play();
    } else {
      this.pause();
    }
  }

  incVolume(v = this.config.volumeStep) {
    this.volume += (v || 0.05);
  }

  decVolume(v = this.config.volumeStep) {
    this.volume -= (v || 0.05);
  }

  seekBackward() {

  }

  seekForward() {
    
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

  enterAirplay() {
    if ((this.media as any).webkitShowPlaybackTargetPicker) {
      (this.media as any).webkitShowPlaybackTargetPicker();
      return true;
    }
    return false;
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

  enterPIP(): Promise<PictureInPictureWindow | void> {
    if ((this.media as any).requestPictureInPicture) {
      return (this.media as HTMLVideoElement).requestPictureInPicture();
    }
    return Promise.resolve();
  }

  exitPIP() {
    if (document.exitPictureInPicture) {
      return document.exitPictureInPicture();
    }
    return Promise.resolve();
  }

  togglePIP() {
    if (document.pictureInPictureElement) {
      return this.exitPIP();
    } else {
      return this.enterPIP();
    }
  }

  destroy() {
    this.off();
    this.fullscreen.destroy()
    this.hotkey.disable();
    this.mediaSession?.destroy()

    this.destroyFns.forEach((fn) => {
      try {
        fn();
      } catch (error) {
        //
      }
    })
  }

  mount(container: Element | string) {
    if (isString(container)) {
      container = document.querySelector(container) as Element;
    }
    if (container) container.appendChild(this.el);
  }
}
