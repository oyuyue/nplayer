import RPlayer from 'rplayer';

export interface AdsItem<T> {
  jumpTo?: string;
  onClick: (item: T) => any;
  [key: string]: any;
}

export interface LinerAdsItem extends AdsItem<LinerAdsItem> {
  src: string;
  playAt?: number;
  playWait?: number;
  duration?: number;
}

export interface NonLinerAdsItem extends AdsItem<NonLinerAdsItem> {
  imgSrc?: string;
  content?: string | Element;
  showed?: number;
  total?: number;
}

export interface AdsOpts {
  liner?: LinerAdsItem[];
  nonLiner?: NonLinerAdsItem[];
  onError?: (
    item: LinerAdsItem | NonLinerAdsItem,
    timeLeft?: number
  ) => boolean | void;
  linerTimeout?: (items: LinerAdsItem[]) => boolean | void;
  enhanceVideo?: (video: HTMLVideoElement) => any;
  adBadge?: boolean;
}

export function processOpts(opts: AdsOpts): AdsOpts {
  opts.adBadge = opts.adBadge == null ? true : opts.adBadge;
  opts.liner = opts.liner || [];
  opts.nonLiner = opts.nonLiner || [];

  opts.liner = opts.liner
    .filter((a) => a.src)
    .map((a) => {
      if (RPlayer.utils.isNum(a.playWait) && !RPlayer.utils.isNum(a.playAt)) {
        a.playAt = Infinity;
      } else {
        a.playAt = a.playAt || 0;
      }
      return a;
    });
  opts.nonLiner = opts.nonLiner
    .filter((a) => a.imgSrc || a.content)
    .map((a) => {
      a.total = a.total || 1;
      a.showed = a.showed || 0;
      return a;
    });

  return opts;
}
