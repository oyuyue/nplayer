import { ControlItem, MediaItem } from '../../types';
import {
  clz, Component, $, hide, formatTime, show,
} from '../../utils';
import { Tooltip } from '..';
import './index.scss';

const cls = clz('ms');
const clsL = cls('l');
const clsR = cls('r');
const clsD = cls('d');
const clsT = cls('t');
const clsTT = cls('tit');

export class MediaSwitcher extends Component implements Partial<ControlItem> {
  tooltip?: Tooltip;

  private cardEl: HTMLElement;

  private imgEl: HTMLImageElement;

  private durEl: HTMLElement;

  private titEl: HTMLElement;

  constructor(public tipText: string, icon: Element) {
    super();

    this.el.appendChild(icon);
    this.cardEl = this.el.appendChild($('.ms'));
    const left = this.cardEl.appendChild($(clsL));
    this.imgEl = left.appendChild($('img'));
    this.durEl = left.appendChild($(clsD));
    const right = this.cardEl.appendChild($(clsR));
    const tipEl = right.appendChild($(clsT));
    this.titEl = right.appendChild($(clsTT));

    tipEl.textContent = tipText;
  }

  setMediaItem(item?: MediaItem) {
    if (!item || (!item.poster && !item.title)) {
      hide(this.cardEl);
      if (this.tooltip) this.tooltip.show();
    } else {
      if (item.poster) {
        this.imgEl.src = item.poster;
      }
      if (item.title) {
        this.titEl.textContent = item.title;
      }
      if (item.duration) {
        this.durEl.textContent = formatTime(item.duration);
      }
      if (this.tooltip) this.tooltip.hide();
      show(this.cardEl);
    }
  }
}
