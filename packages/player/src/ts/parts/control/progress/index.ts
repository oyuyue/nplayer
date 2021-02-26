import { Component } from 'src/ts/component';
import {
  $, addDisposable, Drag, Rect,
} from 'src/ts/utils';

export class Progress extends Component {
  private playedBar: HTMLElement;

  private bufBar: HTMLElement;

  private hoverBar: HTMLElement;

  private bars: HTMLElement;

  private rect: Rect;

  constructor(container: HTMLElement) {
    super(container, '.progress');
    this.bars = this.element.appendChild($('.progress_bars'));
    this.playedBar = this.bars.appendChild($('.progress_played'));
    this.bufBar = this.bars.appendChild($('.progress_buf'));
    this.hoverBar = this.bars.appendChild($('.progress_hover'));

    this.rect = new Rect(this.bars);

    addDisposable(this, new Drag(this.bars, this.onDragStart, this.onDragging, this.onDragEnd));
  }

  private onDragStart = (ev: PointerEvent) => {
    this.onDragging(ev);
  }

  private onDragging = (ev: PointerEvent) => {
    // const x = ev.pageX - this.rect.left;
    // this.playedBar.style.transform = `scaleX(${clamp(x / this.rect.width)})`;
  }

  private onDragEnd = () => {

  }
}
