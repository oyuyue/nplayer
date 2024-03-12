import type { PlayerConfig } from './config';
import { Fullscreen } from './features/fullscreen';
import { WebFullscreen } from './features/web-fullscreen';
import type { Source } from './type'

export class Player {
  el = document.createElement('div');

  media: HTMLMediaElement;

  config: PlayerConfig;

  private prevVolume = 1;

  private fullscreen = new Fullscreen(this);

  private webFullscreen = new WebFullscreen(this);

  constructor() {
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
    this.volume += v;
  }

  decVolume(v = this.config.volumeStep) {
    this.volume -= v;
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
}
