import Component from '../component';
import { THUMB, THUMB_IMG, THUMB_TIME } from '../config/classname';
import RPlayer from '../rplayer';
import { clamp, formatTime, newElement } from '../utils';
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
  private readonly progressBar: ProgressBar;
  private readonly time: HTMLElement;
  private readonly img: HTMLElement;
  private readonly opts: ThumbnailOpts;
  private readonly enableImg: boolean;

  private halfImgWidth: number;
  private thumbNumPerImg: number;
  private ssGapRatio: number;

  constructor(player: RPlayer, progressBar: ProgressBar) {
    super(player, { className: THUMB });

    this.opts = player.options.thumbnail;
    this.enableImg = !!this.opts.images.length || !!this.opts.handler;

    if (this.enableImg) {
      this.halfImgWidth = this.opts.width / 2;
      this.thumbNumPerImg = this.opts.col * this.opts.row;
      this.ssGapRatio = this.opts.startTime / this.opts.gapSec;
    }

    this.progressBar = progressBar;
    this.time = newElement(THUMB_TIME);
    this.img = newElement(THUMB_IMG);

    if (this.enableImg) {
      this.img.style.width = this.opts.width + 'px';
      this.img.style.height = this.opts.height + 'px';
      this.appendChild(this.img);
    }
    this.appendChild(this.time);
  }

  private getCurBg(seconds: number): ThumbnailImgBg {
    if (this.opts.handler) return this.opts.handler(seconds);

    const i = Math.max(seconds / this.opts.gapSec - this.ssGapRatio, 0) | 0;
    const url = this.opts.images[(i / this.thumbNumPerImg) | 0];

    if (!url) return;

    const x = (i % this.opts.col) * this.opts.width;
    const y = ~~((i % this.thumbNumPerImg) / this.opts.row) * this.opts.height;

    return { url, x, y };
  }

  update(left: number, seconds: number): void {
    this.time.innerText = formatTime(seconds);

    let half;
    if (this.enableImg) {
      half = this.halfImgWidth;
      const b = this.getCurBg(seconds);
      if (b && b.url) {
        this.img.style.backgroundImage = `url(${b.url})`;
        this.img.style.backgroundPosition = `-${b.x}px -${b.y}px`;
      }
    } else {
      half = this.rect.width / 2;
    }

    this.addStyle({
      left: `${clamp(left, half, this.progressBar.rect.width - half)}px`,
    });
  }
}
