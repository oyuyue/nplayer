import Liner from '.';
import RPlayer from 'rplayer';
import { throttle, openInNewTab } from '../utils';

export default class Video {
  readonly dom: HTMLVideoElement;
  private readonly liner: Liner;
  private clickLoad = false;
  private muted: boolean;
  private prevTime = 0;

  constructor(liner: Liner, src?: string, muted = false) {
    this.liner = liner;
    this.muted = muted;
    this.dom = RPlayer.utils.newElement('', 'video');

    this.dom.addEventListener('click', this.onClick);
    this.dom.addEventListener('play', this.onPlay);
    this.dom.addEventListener('pause', this.onPause);
    this.dom.addEventListener('canplay', this.onCanPlay);
    this.dom.addEventListener('volumechange', this.onVolumeChange);
    this.dom.addEventListener('ratechange', this.onRateChange);
    this.dom.addEventListener('timeupdate', this.onTimeUpdate);
    this.dom.addEventListener('seeking', this.onSeeking);
    this.dom.addEventListener('error', this.onError);
    this.dom.addEventListener('ended', this.onEnded);

    this.dom.controls = false;
    this.dom.autoplay = false;
    this.dom.loop = false;
    this.dom.playbackRate = 1;
    this.dom.setAttribute('playsinline', '');
    this.dom.muted = muted;
    this.hide();
    if (src) {
      this.dom.src = src;
      this.dom.load();
    }

    if (liner.opts.enhanceVideo) {
      liner.opts.enhanceVideo(this.dom);
    }

    this.liner.appendVideo(this.dom);
  }

  get playing(): boolean {
    return this.dom.played.length && !this.dom.paused && !this.dom.ended;
  }

  get duration(): number {
    return this.dom.duration || 0;
  }

  get currentTime(): number {
    return this.dom.currentTime || 0;
  }

  get isMuted(): boolean {
    return this.dom.muted || this.dom.volume <= 0;
  }

  private onClick = (): void => {
    this.play();
    const ad = this.liner.currentItem?.ad;
    if (ad) {
      if (ad.jumpTo) {
        this.pause();
        openInNewTab(ad.jumpTo);
      }

      if (ad.onClick) ad.onClick(ad);
    }
  };

  private onCanPlay = (): void => {
    if (this === this.liner.currentItem.video) {
      this.playVideo();
    }
  };

  private onPlay = (): void => {
    this.liner.onVideoPlay();
    this.onVolumeChange();
  };

  private onPause = (): void => {
    this.liner.onVideoPause();
  };

  private onTimeUpdate = throttle((): void => {
    if (!this.dom.seeking) this.prevTime = this.dom.currentTime;
  });

  private onVolumeChange = (): void => {
    if (this.isMuted) {
      this.liner.onVideoMuted();
    } else {
      this.liner.onVideoUnmuted();
    }
  };

  private onSeeking = (): void => {
    const delta = this.dom.currentTime - this.prevTime;
    if (Math.abs(delta) > 1) this.dom.currentTime = this.prevTime;
  };

  private onRateChange = (): void => {
    this.dom.playbackRate = 1;
  };

  private onError = (): void => {
    if (this.liner.onVideoError()) {
      this.onEnded();
    } else {
      this.dom.load();
    }
  };

  private onEnded = (): void => {
    this.destroy();
    this.liner.playNext();
  };

  private playVideo(): void {
    const play = this.dom.play();
    if (RPlayer.utils.isCatchable(play)) {
      play.catch(() => {
        this.dom.muted = true;
        this.dom.play().catch(() => {
          this.dom.pause();
          this.onPause();
        });
      });
    }
    this.dom.muted = this.muted;
  }

  play(src?: string): void {
    if (!this.liner.playing) return;
    this.show();

    if (src) {
      this.dom.src = src;
    } else if (this.playing) return;
    if (!this.dom.src) return;

    if (!this.dom.parentNode.contains(this.dom)) {
      this.liner.appendVideo(this.dom);
    }

    if (
      !this.dom.played.length &&
      !this.dom.ended &&
      this.dom.readyState <= 2 &&
      !this.clickLoad
    ) {
      this.dom.load();
      this.clickLoad = true;
      this.onPause();
    } else if (this.dom.paused) {
      this.playVideo();
    }
  }

  mute(): void {
    this.muted = true;
    this.dom.muted = true;
  }

  unmute(): void {
    this.muted = false;
    this.dom.muted = false;
  }

  toggleVolume(): void {
    if (this.isMuted) {
      this.unmute();
    } else {
      this.mute();
    }
  }

  pause(): void {
    this.dom.pause();
  }

  show(): void {
    this.dom.hidden = false;
  }

  hide(): void {
    this.dom.hidden = true;
  }

  destroy(): void {
    this.pause();
    this.dom.autoplay = false;
    this.hide();
    this.dom.removeAttribute('src');
    if (this.dom.parentNode) {
      this.dom.parentNode.removeChild(this.dom);
    }
  }
}
