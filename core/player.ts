import type { MediaInfo, PlayerConfig } from './config';
import type { Source } from './type'
import { transferEvent, type PlayerEvents, Events, MediaInfoEvent } from './event';
import { EventEmitter } from './event-emitter';
import { Fullscreen } from './features/fullscreen';
import { Hotkey } from './features/hotkey';
import { PlayerMediaSession } from './features/media-session';
import { WebFullscreen } from './features/web-fullscreen';

export class Player extends EventEmitter<PlayerEvents> {
  el = document.createElement('div');

  media: HTMLMediaElement;

  config: PlayerConfig;

  private prevVolume = 1;

  private fullscreen = new Fullscreen(this);

  private webFullscreen = new WebFullscreen(this);

  private hotkey = new Hotkey(this);

  private mediaSession?: PlayerMediaSession = PlayerMediaSession.create(this);

  private destroyFns: (() => void)[] = [];

  constructor() {
    super()
    this.destroyFns.push(transferEvent(this))
    this.media.controls = false;
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
}
