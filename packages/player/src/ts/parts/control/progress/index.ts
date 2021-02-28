import {
  $, addDisposable, addDisposableListener, clamp, Component, Drag, Rect, throttle,
} from 'src/ts/utils';
import { Thumbnail } from './thumbnail';

export class Progress extends Component {
  private playedBar: HTMLElement;

  private bufBar: HTMLElement;

  private bars: HTMLElement;

  private rect: Rect;

  private thumbnail: Thumbnail;

  constructor(container: HTMLElement) {
    super(container, '.progress');
    this.bars = this.element.appendChild($('.progress_bars'));
    this.playedBar = this.bars.appendChild($('.progress_played'));
    this.bufBar = this.bars.appendChild($('.progress_buf'));

    this.rect = new Rect(this.bars);
    this.thumbnail = new Thumbnail(this.element, { images: ['M1.jpg'] });

    addDisposable(this, new Drag(this.bars, this.onDragStart, this.onDragging, this.onDragEnd));

    addDisposableListener(this, this.bars, 'mousemove', (ev: MouseEvent) => {
      this.updateThumbnail(ev.pageX);
    }, true);
  }

  private onDragStart = (ev: PointerEvent) => {
    this.onDragging(ev);
  }

  private onDragging = (ev: PointerEvent) => {
    const x = ev.pageX - this.rect.x;
    this.playedBar.style.transform = `scaleX(${clamp(x / this.rect.width)})`;
    this.updateThumbnail(ev.pageX);
  }

  private onDragEnd = () => {

  }

  private updateThumbnail(x: number): void {
    this.thumbnail.update(this.getCurrentTime(x), x - this.rect.x, this.rect.width);
  }

  private getCurrentTime(x: number): number {
    return ((x - this.rect.x) / this.rect.width) * 100;
  }
}
