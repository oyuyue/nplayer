import RPlayer from 'rplayer';
import { AdsOpts, LinerAdsItem } from './options';
import { throttle } from './utils';

export default class Liner {
  readonly dom: HTMLElement;
  private readonly opts: AdsOpts;
  private player: RPlayer;

  private adsItems: LinerAdsItem[];
  private remainTime = 0;
  private currentPlayIndex = 0;

  private playlist: LinerAdsItem[] = [];
  private videos: HTMLVideoElement[] = [];
  private videoCurrentTimes = [0, 0];

  private totalPlayTime = 0;

  private tickTimer: NodeJS.Timeout;
  private tickRemainTimer: NodeJS.Timeout;
  private prevPlayCurrentTime = 0;

  playing = false;

  constructor(opts: AdsOpts) {
    this.opts = opts;
    this.dom = RPlayer.utils.newElement('rplayer_ad_liner');
    this.adsItems = opts.liner;

    this.videos[0] = RPlayer.utils.newElement('', 'video');
    this.videos[1] = RPlayer.utils.newElement('', 'video');

    this.dom.addEventListener(
      'click',
      (ev: MouseEvent) => {
        ev.preventDefault();
        ev.stopImmediatePropagation();
        this.playVideo();
      },
      true
    );

    this.videos.forEach((v, i) => {
      v.loop = false;
      v.controls = false;

      v.addEventListener('play', () => {
        this.tickRemain();
      });

      v.addEventListener(
        'timeupdate',
        throttle(() => {
          if (!v.seeking) this.videoCurrentTimes[i] = v.currentTime;
        })
      );

      v.addEventListener('seeking', () => {
        const delta = v.currentTime - this.videoCurrentTimes[i];
        if (Math.abs(delta) > 1) v.currentTime = this.videoCurrentTimes[i];
      });

      v.addEventListener('error', () => {
        if (this.playlist[this.currentPlayIndex]) {
          let retry = false;
          if (this.opts.onError) {
            retry = this.opts.onError(
              this.playlist[this.currentPlayIndex]
            ) as boolean;
          }

          if (retry) {
            this.playVideo();
          } else {
            this.onVideoEnded(v);
          }
        }
      });

      v.addEventListener('ended', () => this.onVideoEnded(v));
    });

    const d1 = RPlayer.utils.newElement();
    const d2 = RPlayer.utils.newElement();
    d1.appendChild(this.videos[0]);
    d2.appendChild(this.videos[1]);
    this.dom.appendChild(d1);
    this.dom.appendChild(d2);
    this.hide();
  }

  install(player: RPlayer): void {
    this.player = player;

    player.on(RPlayer.Events.PLAY, this.tick);
    player.on(RPlayer.Events.PAUSE, this.untick);
    player.on(RPlayer.Events.ENDED, this.untick);
    player.on(RPlayer.Events.LOADING_SHOW, this.untick);
    player.on(RPlayer.Events.LOADING_HIDE, this.tick);
    if (player.playing) this.tick();

    player.on(RPlayer.Events.TIME_UPDATE, this.checkCanPlay);
    this.checkCanPlay();
  }

  show(): void {
    this.dom.hidden = false;
  }

  hide(): void {
    this.dom.hidden = true;
  }

  private disablePlayer(): void {
    this.prevPlayCurrentTime = this.player.currentTime;
    this.player.on(RPlayer.Events.PLAY, this.pausePlayer);
    this.player.on(RPlayer.Events.TIME_UPDATE, this.pausePlayer);
    this.player.pause();
  }

  private restorePlayer(): void {
    this.player.off(RPlayer.Events.PLAY, this.pausePlayer);
    this.player.off(RPlayer.Events.TIME_UPDATE, this.pausePlayer);
    this.player.currentTime = this.prevPlayCurrentTime;
    this.player.play();
  }

  private play(items?: LinerAdsItem[]): void {
    if (items && items.length) this.playlist = items;

    const v1 = this.videos[0];
    const v2 = this.videos[1];

    if (!this.playlist.length && !v1.src && !v2.src) {
      this.restorePlayer();
      this.playing = false;
      this.hide();
      return;
    }

    this.playing = true;
    this.calcRemainTime();
    const s1 = this.playlist[0]?.src;
    const s2 = this.playlist[1]?.src;

    if (!v1.src) {
      v1.src = s1;
      v1.load();
    } else if (!v2.src) {
      v2.src = s1;
      v2.load();
    }
    if (!v2.src && s2) {
      v2.src = s2;
      v2.load();
    }

    this.playVideo();
  }

  private playVideo(): void {
    const video = this.videos[this.currentPlayIndex];
    if (!video) return;

    this.videoCurrentTimes[this.currentPlayIndex] = 0;
    this.showVideo();

    if (!video.played.length && !video.ended && video.readyState <= 2) {
      video.autoplay = true;
      video.muted = true;
      video.load();
    }

    if (video.paused) {
      const play = video.play();
      if (RPlayer.utils.isCatchable(play)) {
        play.catch(() => {
          video.muted = true;
          video.play();
        });
      }
    }
  }

  private showVideo(): void {
    const children = this.dom.children as any;
    for (let i = 0, l = children.length; i < l; i++) {
      if (i === this.currentPlayIndex) {
        children[i].hidden = false;
      } else {
        children[i].hidden = true;
      }
    }
  }

  private checkCanPlay = throttle((): void => {
    if (this.playing) return;
    if (!this.adsItems.length) {
      this.player.off(RPlayer.Events.TIME_UPDATE, this.checkCanPlay);
      this.hide();
      return;
    }

    const curTime = this.player.currentTime;
    const needPlay = this.adsItems.filter((ad) => {
      if (ad.playWait) return ad.playWait <= this.totalPlayTime;
      return ad.playAt <= curTime;
    });

    if (needPlay.length) {
      this.disablePlayer();
      this.show();
      this.play(needPlay);
    }
  });

  private calcRemainTime(): void {
    this.remainTime = this.playlist.reduce((a, c) => {
      a += c.duration || 0;
      return a;
    }, 0);
  }

  private tickRemain = (): void => {
    this.untickRemain();
    this.tickRemainTimer = setInterval(() => {
      if (this.remainTime <= 0) {
        return this.untick();
      }
      this.remainTime--;
    }, 1000);
  };

  private untickRemain = (): void => {
    clearInterval(this.tickRemainTimer);
  };

  private tick = (): void => {
    this.untick();
    this.tickTimer = setInterval(() => {
      this.totalPlayTime++;
    }, 1000);
  };

  private untick = (): void => {
    clearInterval(this.tickTimer);
  };

  private onVideoEnded(v: HTMLVideoElement): void {
    v.removeAttribute('src');
    v.autoplay = false;
    v.muted = false;
    this.untickRemain();
    this.videoCurrentTimes[this.currentPlayIndex] = 0;
    const item = this.playlist[this.currentPlayIndex];
    this.playlist = this.playlist.filter((ad) => ad !== item);
    this.adsItems = this.adsItems.filter((ad) => ad !== item);
    this.currentPlayIndex = this.currentPlayIndex ? 0 : 1;
    this.play();
  }

  private pausePlayer = (): void => {
    this.player.pause();
  };
}
