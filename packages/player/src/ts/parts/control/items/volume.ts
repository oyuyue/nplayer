import { icons } from 'src/ts/icons';
import {
  $, addDisposable, clamp, Component, Drag, hide, Rect,
} from 'src/ts/utils';
import { ControlTip } from './helper';

export class VolumeControlItem extends Component {
  private readonly volumeIcon: HTMLElement;

  private readonly mutedIcon: HTMLElement;

  private readonly tip: ControlTip;

  private readonly bar: HTMLElement;

  private readonly rect: Rect;

  constructor(container: HTMLElement, private barWidth = 100) {
    super(container, '.control_volume');
    this.tip = new ControlTip(this.element, '静音');
    this.volumeIcon = this.element.appendChild(icons.volume());
    this.mutedIcon = this.element.appendChild(icons.muted());
    hide(this.mutedIcon);

    const bars = this.element.appendChild($('.control_volume_bars'));
    bars.style.width = `${barWidth}px`;

    this.bar = bars.appendChild($('.control_volume_bar'));

    this.rect = new Rect(this.bar);

    addDisposable(this, new Drag(bars, this.onDragStart, this.onDragging, this.onDragEnd));
  }

  private onDragStart = (ev: PointerEvent) => {
    this.onDragging(ev);
  }

  private onDragging = (ev: PointerEvent) => {
    const x = ev.pageX - this.rect.x;
    this.bar.style.transform = `scaleX(${clamp(x / this.rect.width)})`;
  }

  private onDragEnd = () => {

  }
}
