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
export declare function processOpts(opts: AdsOpts): AdsOpts;
//# sourceMappingURL=options.d.ts.map