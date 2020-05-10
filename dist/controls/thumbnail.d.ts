import Component from '../component';
import RPlayer from '../rplayer';
import ProgressBar from './progress-bar';
export interface ThumbnailImgBg {
    x: number;
    y: number;
    url: string;
}
declare class Thumbnail extends Component {
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
export default Thumbnail;
