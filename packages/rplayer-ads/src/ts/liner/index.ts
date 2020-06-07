import RPlayer from 'rplayer';
import Events from '../events';
import { AdsOpts, LinerAdsItem } from '../options';
import { throttle, getAdBadge } from '../utils';
import Video from './video';
import Ads from '..';

type PlayItem = { ad: LinerAdsItem; video: Video };

export default class Liner {
  readonly dom: HTMLElement;
  private readonly ads: Ads;
  private videoContainer: HTMLElement;
  private countDownDom: HTMLElement;

  readonly opts: AdsOpts;
  private player: RPlayer;

  private adsItems: LinerAdsItem[];
  private remainTime = 0;

  private playlist: PlayItem[] = [];
  currentItem: PlayItem;

  private totalPlayTime = 0;

  private tickTimer: NodeJS.Timeout;
  private tickRemainTimer: NodeJS.Timeout;
  private prevPlayerCurrentTime = 0;
  private muted = false;

  playing = false;

  constructor(ads: Ads) {
    this.ads = ads;
    this.opts = ads.opts;
    this.dom = RPlayer.utils.newElement('rplayer_ad_liner');
    this.adsItems = ads.opts.liner;
  }

  get timeLeft(): number {
    return this.remainTime;
  }

  private disablePlayer(): void {
    this.prevPlayerCurrentTime = this.player.currentTime;
    this.player.on(RPlayer.Events.PLAY, this.pausePlayer);
    this.player.on(RPlayer.Events.TIME_UPDATE, this.pausePlayer);
    this.player.pause();
  }

  private restorePlayer(): void {
    this.player.off(RPlayer.Events.PLAY, this.pausePlayer);
    this.player.off(RPlayer.Events.TIME_UPDATE, this.pausePlayer);
    this.player.currentTime = this.prevPlayerCurrentTime;
    this.player.play();
  }

  private checkCanPlay = throttle((): void => {
    if (this.playing) return;
    if (!this.adsItems.length) {
      this.player.off(RPlayer.Events.TIME_UPDATE, this.checkCanPlay);
      return this.end();
    }

    const curTime = this.player.currentTime;
    const needPlay: LinerAdsItem[] = [];
    const rest: LinerAdsItem[] = [];

    this.adsItems.forEach((ad) => {
      if (
        (ad.playWait && ad.playWait <= this.totalPlayTime) ||
        ad.playAt <= curTime
      ) {
        needPlay.push(ad);
      } else {
        rest.push(ad);
      }
    });

    this.adsItems = rest;

    if (needPlay.length) this.play(needPlay);
  });

  private calcRemainTime(): void {
    this.remainTime = this.playlist.reduce((a, c) => {
      a += c.ad.duration || 0;
      return a;
    }, 0);

    if (this.currentItem) {
      const video = this.currentItem.video;

      if (video.duration) {
        this.remainTime += video.duration - video.currentTime;
      } else {
        this.remainTime += this.currentItem.ad.duration;
      }

      this.remainTime = Math.ceil(this.remainTime);
    }

    this.setCountDown();
  }

  private tickRemain = (): void => {
    this.untickRemain();
    this.tickRemainTimer = setInterval(() => {
      if (this.remainTime <= 0) {
        const list = this.playlist.map((x) => x.ad);
        list.unshift(this.currentItem.ad);
        if (this.opts.linerTimeout && this.opts.linerTimeout(list)) {
          return this.skip();
        }

        return this.calcRemainTime();
      }

      this.remainTime--;
      this.setCountDown();
    }, 1000);
  };

  private untickRemain = (): void => {
    clearInterval(this.tickRemainTimer);
  };

  private tick = (): void => {
    this.untick();
    if (this.playing) return;
    this.tickTimer = setInterval(() => {
      this.totalPlayTime++;
    }, 1000);
  };

  private untick = (): void => {
    clearInterval(this.tickTimer);
  };

  private pausePlayer = (): void => {
    this.player.pause();
  };

  skip(): void {
    if (this.currentItem) {
      this.currentItem.video.destroy();
    }
    this.end();
  }

  show(): void {
    this.dom.hidden = false;
  }

  hide(): void {
    this.dom.hidden = true;
  }

  end(): void {
    if (!this.playing) return;
    this.playing = false;
    this.currentItem = null;
    this.player.fullscreen.setTarget();
    this.hideCountDown();
    this.untickRemain();
    this.hide();
    this.restorePlayer();
    this.destroyVideos();

    this.ads.emit(Events.LINER_AD_END);
  }

  destroyVideos(): void {
    if (this.playlist.length) {
      this.playlist.forEach(({ video }) => video.destroy());
      this.playlist = [];
    }
  }

  setCountDown(t = this.remainTime): void {
    this.countDownDom.innerText = t.toString();
  }

  showCountDown(): void {
    this.countDownDom.style.opacity = '1';
  }

  hideCountDown(): void {
    this.countDownDom.style.opacity = '0';
  }

  appendVideo(dom: HTMLVideoElement): void {
    this.videoContainer.appendChild(dom);
  }

  onVideoError(): boolean | void {
    if (this.opts.onError) {
      return this.opts.onError(this.currentItem.ad, this.remainTime);
    }
  }

  onVideoPlay(): void {
    this.dom.classList.add('rplayer_ad_liner-playing');
    this.tickRemain();
  }

  onVideoPause(): void {
    this.dom.classList.remove('rplayer_ad_liner-playing');
    this.untickRemain();
  }

  onVideoMuted(): void {
    this.muted = true;
    this.playlist.forEach((i) => i.video.mute());
    this.dom.classList.add('rplayer_ad_liner-muted');
  }

  onVideoUnmuted(): void {
    this.muted = false;
    this.playlist.forEach((i) => i.video.unmute());
    this.dom.classList.remove('rplayer_ad_liner-muted');
  }

  play(items: LinerAdsItem[]): void {
    if (!items || !items.length) return;
    this.playing = true;

    this.playlist = items.map((ad) => ({
      ad,
      video: new Video(this, ad.src, this.muted),
    }));

    this.disablePlayer();
    this.show();
    this.playNext();

    this.calcRemainTime();
    if (this.remainTime) this.showCountDown();
  }

  playNext(): void {
    if (!this.playlist.length) return this.end();

    const item = this.playlist.shift();
    this.currentItem = item;
    item.video.play();

    this.player.fullscreen.setTarget(this.dom, item.video.dom);

    this.ads.emit(Events.LINER_AD_PLAY);
  }

  private onEnterFullscreen = (): void => {
    this.dom.classList.add('rplayer_ad_liner-fs');
  };

  private onExitFullscreen = (): void => {
    this.dom.classList.remove('rplayer_ad_liner-fs');
  };

  private onPlayerEnded = (): void => {
    this.play(this.adsItems);
    this.adsItems = [];
  };

  install(player: RPlayer): void {
    this.player = player;

    this.dom.addEventListener('click', (ev: MouseEvent) => {
      ev.preventDefault();
      ev.stopImmediatePropagation();
    });

    this.dom.addEventListener('contextmenu', (ev: MouseEvent) => {
      ev.preventDefault();
      ev.stopImmediatePropagation();
    });

    this.videoContainer = RPlayer.utils.newElement('rplayer_ad_liner_videos');

    const playPause = this.getCtrlDom(() => {
      const v = this.currentItem.video;
      if (v.playing) {
        v.pause();
      } else {
        v.play();
      }
    }, 'rplayer_ad_liner_play');
    playPause.appendChild(RPlayer.icons.play('rplayer_ad_liner_i_play'));
    playPause.appendChild(RPlayer.icons.pause('rplayer_ad_liner_i_pause'));

    const volume = this.getCtrlDom(
      () => this.currentItem.video.toggleVolume(),
      'rplayer_ad_liner_volume'
    );
    volume.appendChild(RPlayer.icons.volume('rplayer_ad_liner_i_volume'));
    volume.appendChild(RPlayer.icons.muted('rplayer_ad_liner_i_muted'));

    const full = this.getCtrlDom(
      () => this.player.fullscreen.toggle(),
      'rplayer_ad_liner_full'
    );
    full.appendChild(RPlayer.icons.enterFullscreen('rplayer_ad_liner_i_fs'));
    full.appendChild(RPlayer.icons.exitFullscreen('rplayer_ad_liner_i_efs'));

    this.countDownDom = RPlayer.utils.newElement('rplayer_ad_liner_cd');

    if (this.opts.adBadge) {
      this.dom.appendChild(getAdBadge(player));
    }

    this.dom.appendChild(this.videoContainer);
    this.dom.appendChild(playPause);
    this.dom.appendChild(volume);
    this.dom.appendChild(full);
    this.dom.appendChild(this.countDownDom);

    player.on(RPlayer.Events.PLAY, this.tick);
    player.on(RPlayer.Events.PAUSE, this.untick);
    player.on(RPlayer.Events.ENDED, this.untick);
    player.on(RPlayer.Events.LOADING_SHOW, this.untick);
    player.on(RPlayer.Events.LOADING_HIDE, this.tick);
    player.on(RPlayer.Events.ENTER_FULLSCREEN, this.onEnterFullscreen);
    player.on(RPlayer.Events.EXIT_FULLSCREEN, this.onExitFullscreen);
    player.on(RPlayer.Events.ENDED, this.onPlayerEnded);
    if (player.playing) this.tick();

    player.on(RPlayer.Events.TIME_UPDATE, this.checkCanPlay);
    this.checkCanPlay();
  }

  private getCtrlDom(onClick: () => void, cls?: string): HTMLElement {
    const dom = RPlayer.utils.newElement('rplayer_ad_liner_ctrl');
    if (cls) dom.classList.add(cls);
    dom.addEventListener(
      'click',
      (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        if (this.currentItem) onClick();
      },
      true
    );
    dom.addEventListener('dblclick', (ev) => {
      ev.preventDefault();
      ev.stopImmediatePropagation();
    });
    return dom;
  }
}
