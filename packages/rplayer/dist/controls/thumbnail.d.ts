import Component from '../component';
import RPlayer from '../rplayer';
import ProgressBar from './progress-bar';
export interface ThumbnailImgBg {
    x: number;
    y: number;
    url: string;
}
export interface ThumbnailOpts {
    startTime?: number;
    gapSec?: number;
    col?: number;
    row?: number;
    width?: number;
    height?: number;
    images?: string[];
    handler?: (seconds: number) => ThumbnailImgBg;
}
export default class Thumbnail extends Component {
    private readonly progressBar;
    private readonly time;
    private readonly img;
    private readonly opts;
    private readonly enableImg;
    private halfImgWidth;
    private thumbNumPerImg;
    private ssGapRatio;
    constructor(player: RPlayer, progressBar: ProgressBar);
    private getCurBg;
    update(left: number, seconds: number): void;
}
//# sourceMappingURL=thumbnail.d.ts.map