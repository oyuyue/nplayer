import Ads from '.';
import RPlayer from 'rplayer';
import { getAdBadge, openInNewTab } from './utils';
import { NonLinerAdsItem } from './options';

export default class NonLiner {
  private readonly ads: Ads;
  readonly dom: HTMLElement;
  private readonly closeDom: HTMLElement;

  private adsItems: NonLinerAdsItem[];
  private currentAd: { ad: NonLinerAdsItem; dom: HTMLElement };

  constructor(ads: Ads) {
    this.ads = ads;
    this.adsItems = ads.opts.nonLiner;
    this.dom = RPlayer.utils.newElement('rplayer_ad_nonliner');
    this.dom.addEventListener('click', this.onDomClick);
    this.closeDom = RPlayer.utils.newElement('rplayer_ad_nonliner_close');
    this.closeDom.addEventListener('click', this.onClose, true);
    this.dom.appendChild(this.closeDom);
  }

  show(): void {
    if (!this.currentAd) return;
    this.dom.classList.add('rplayer_ad_nonliner-active');
    this.currentAd.ad.showed++;
  }

  hide = (): void => {
    this.dom.classList.remove('rplayer_ad_nonliner-active');

    if (this.currentAd) {
      this.currentAd.dom.parentNode.removeChild(this.currentAd.dom);
    }

    this.currentAd = null;
    this.adsItems = this.adsItems.filter((ad) => ad.showed < ad.total);

    if (this.adsItems.length) {
      const ad = this.adsItems[0];

      let dom: HTMLElement;
      if (ad.imgSrc) {
        dom = document.createElement('img');
        (dom as any).src = ad.imgSrc;
      } else if (typeof ad.content === 'string') {
        dom = RPlayer.utils.htmlDom(ad.content);
      } else {
        dom = ad.content as HTMLElement;
      }

      dom.classList.add('rplayer_ad_nonliner_content');
      this.dom.appendChild(dom);
      this.currentAd = { ad, dom };
    }
  };

  private onPlayerPause = (): void => {
    if (this.ads.liner.playing) return;
    this.show();
  };

  private onDomClick = (ev: MouseEvent): void => {
    ev.preventDefault();
    ev.stopImmediatePropagation();
    const ad = this.currentAd?.ad;
    if (ad) {
      if (ad.jumpTo) {
        openInNewTab(ad.jumpTo);
      }

      if (ad.onClick) ad.onClick(ad);
    }
  };

  private onClose = (ev: MouseEvent): void => {
    ev.preventDefault();
    ev.stopImmediatePropagation();
    this.hide();
  };

  install(player: RPlayer): void {
    if (this.ads.opts.adBadge) {
      this.dom.appendChild(getAdBadge(player));
    }

    player.on(RPlayer.Events.PLAY, this.hide);
    player.on(RPlayer.Events.PAUSE, this.onPlayerPause);

    this.hide();
  }
}
