import { Component } from '../../../utils';
export interface ThumbnailOptions {
    startSecond?: number;
    gapSecond?: number;
    row?: number;
    col?: number;
    width?: number;
    height?: number;
    images?: string[];
}
export interface ThumbImg {
    url: string;
    x: number;
    y: number;
}
export declare class Thumbnail extends Component {
    private opts;
    private imgElement?;
    private timeElement;
    private thumbImgPrePic?;
    private ssGapRatio?;
    private rect;
    constructor(container: HTMLElement, opts: ThumbnailOptions);
    private getCurrentThumb;
    update(seconds: number, x: number, maxX: number): void;
}
