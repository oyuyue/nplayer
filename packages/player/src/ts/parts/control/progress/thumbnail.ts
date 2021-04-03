import {
  $, clamp, Component, formatTime, Rect,
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
  private opts: Required<ThumbnailOptions>;

  private imgElement?: HTMLElement;

  private timeElement: HTMLElement;

  private thumbImgPrePic?: number;

  private ssGapRatio?: number;

  private rect: Rect;

  constructor(container: HTMLElement, opts: ThumbnailOptions) {
    super(container, '.thumb');
    this.opts = {
      startSecond: 0,
      gapSecond: 10,
      col: 5,
      row: 5,
      width: 160,
      height: 90,
      images: [],
      ...opts,
    };

    if (this.opts.images.length) {
      this.imgElement = this.element.appendChild($('.thumb_img'));
      this.imgElement.style.width = `${this.opts.width}px`;
      this.imgElement.style.height = `${this.opts.height}px`;
      this.thumbImgPrePic = this.opts.col * this.opts.row;
      this.ssGapRatio = this.opts.startSecond / this.opts.gapSecond;
    }

    this.timeElement = this.element.appendChild($('.thumb_time'));
    this.timeElement.textContent = '0:00';

    this.rect = new Rect(this.element);
  }

  private getCurrentThumb(seconds: number): ThumbImg | void {
    const i = Math.max(seconds / this.opts.gapSecond - this.ssGapRatio!, 0) | 0;
    const url = this.opts.images[(i / this.thumbImgPrePic!) | 0];

    if (!url) return;

    const x = (i % this.opts.col) * this.opts.width;
    const y = ~~((i % this.thumbImgPrePic!) / this.opts.row) * this.opts.height;

    return { url, x, y };
  }

  update(seconds: number, x: number, maxX: number): void {
    this.timeElement.textContent = formatTime(seconds);

    if (this.imgElement) {
      const thumb = this.getCurrentThumb(seconds);
      if (thumb) {
        this.imgElement.style.backgroundImage = `url(${thumb.url})`;
        this.imgElement.style.backgroundPosition = `-${thumb.x}px -${thumb.y}px`;
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
