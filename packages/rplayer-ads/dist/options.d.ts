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
    onError?: (item: LinerAdsItem | NonLinerAdsItem, timeLeft?: number) => boolean | void;
    linerTimeout?: (items: LinerAdsItem[]) => boolean | void;
    enhanceVideo?: (video: HTMLVideoElement) => any;
    adBadge?: boolean;
}
export declare function processOpts(opts: AdsOpts): AdsOpts;
//# sourceMappingURL=options.d.ts.map