export interface AdsItem<T> {
  jumpTo?: string;
  onClick: (item: T, ev: MouseEvent) => any;
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
  beforePlayLiner: (item: LinerAdsItem) => boolean | Promise<boolean>;
  beforePlayNonLiner: (item: NonLinerAdsItem) => boolean | Promise<boolean>;
  onError: (item: LinerAdsItem | NonLinerAdsItem) => boolean | void;
  linerPromptBefore?: number;
  adBadge: boolean;
}

export function processOpts(opts: AdsOpts): AdsOpts {
  opts.adBadge = opts.adBadge == null ? true : opts.adBadge;
  opts.linerPromptBefore = opts.linerPromptBefore || 5;
  opts.liner = opts.liner || [];
  opts.nonLiner = opts.nonLiner || [];

  opts.liner = opts.liner
    .filter((a) => a.src)
    .map((a) => {
      a.playAt = a.playAt || 0;
      return a;
    });
  opts.nonLiner = opts.nonLiner
    .filter((a) => a.imgSrc || a.content)
    .map((a) => {
      a.total = a.total || 1;
      return a;
    });

  return opts;
}
