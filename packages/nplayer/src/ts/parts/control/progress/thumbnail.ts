import {
  $, addDisposable, clamp, Component, formatTime, Rect,
} from 'src/ts/utils';

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

export class Thumbnail extends Component {
  private opts: Required<ThumbnailOptions> = {
    startSecond: 0,
    gapSecond: 10,
    col: 5,
    row: 5,
    width: 160,
    height: 90,
    images: [],
  };

  private imgEl?: HTMLElement;

  private timeEl: HTMLElement;

  private thumbImgPrePic?: number;

  private ssGapRatio?: number;

  private rect: Rect;

  constructor(container: HTMLElement, opts: ThumbnailOptions) {
    super(container, '.thumb');

    this.updateOptions(opts);

    this.timeEl = this.el.appendChild($('.thumb_time'));
    this.timeEl.textContent = '0:00';

    this.rect = addDisposable(this, new Rect(this.el));
  }

  private getCurrentThumb(seconds: number): ThumbImg | void {
    const i = Math.max(seconds / this.opts.gapSecond - this.ssGapRatio!, 0) | 0;
    const url = this.opts.images[(i / this.thumbImgPrePic!) | 0];

    if (!url) return;

    const x = (i % this.opts.col) * this.opts.width;
    const y = ~~((i % this.thumbImgPrePic!) / this.opts.col) * this.opts.height;

    return { url, x, y };
  }

  updateOptions(opts: ThumbnailOptions): void {
    Object.assign(this.opts, opts);

    if (this.opts.images.length) {
      if (!this.imgEl) {
        this.imgEl = this.el.appendChild($('.thumb_img'));
      }
      this.imgEl.style.width = `${this.opts.width}px`;
      this.imgEl.style.height = `${this.opts.height}px`;
      this.thumbImgPrePic = this.opts.col * this.opts.row;
      this.ssGapRatio = this.opts.startSecond / this.opts.gapSecond;
    }
  }

  update(seconds: number, x: number, maxX: number): void {
    this.timeEl.textContent = formatTime(seconds);

    if (this.imgEl) {
      const thumb = this.getCurrentThumb(seconds);
      if (thumb) {
        this.imgEl.style.backgroundImage = `url(${thumb.url})`;
        this.imgEl.style.backgroundPosition = `-${thumb.x}px -${thumb.y}px`;
      }
    } else {
      this.rect.update();
    }

    const half = this.rect.width / 2;

    this.applyStyle({
      left: `${clamp(x - half, 0, Math.max(0, maxX - 2 * half))}px`,
    });
  }
}
