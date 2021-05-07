import { EVENT } from 'src/ts/constants';
import { Player } from 'src/ts/player';
import {
  $, addDisposable, clamp, Component, Drag, Rect,
} from 'src/ts/utils';

export interface SliderOption {
  value?: number;
  stops?: { value: number, html?: string }[];
  change?: (value: number) => void;
  step?: boolean;
}

export class Slider extends Component {
  private readonly trackElement: HTMLElement;

  private readonly dotElement: HTMLElement;

  private readonly step: boolean | undefined;

  readonly rect: Rect;

  constructor(container: HTMLElement, private opts: SliderOption, player?: Player) {
    super(container, '.slider');

    this.rect = new Rect(this.el);

    this.trackElement = this.el.appendChild($('.slider_track')).appendChild($('.slider_track_inner'));
    if (opts.stops) {
      let stop;
      opts.stops.forEach((s) => {
        stop = $('.slider_stop', undefined, s.html ? `<span>${s.html}</span>` : '');
        stop.style.left = `${s.value * 100}%`;
        this.el.appendChild(stop);
      });
    }
    this.dotElement = this.el.appendChild($('.slider_dot'));

    addDisposable(this, new Drag(this.el, this.onDrag, this.onDrag));

    this.step = opts.stops && opts.step;

    this.update(opts.value || 0, undefined, false);

    if (player) addDisposable(this, player.on(EVENT.UPDATE_SIZE, () => this.rect.update()));
  }

  private onDrag = (ev: PointerEvent) => {
    const x = ev.pageX - this.rect.x;
    this.update(x / this.rect.width, x);
  }

  update(value: number, x?: number, trigger = true): void {
    if (this.step) {
      let closed = Infinity;
      let v = 0; let c;
      this.opts.stops!.forEach((s) => {
        c = Math.abs(value - s.value);
        if (c < closed) {
          closed = c;
          v = s.value;
        }
      });
      value = v;
      x = null!;
    }

    x = x != null ? x : value * this.rect.width;
    this.trackElement.style.transform = `scaleX(${clamp(value)})`;
    this.dotElement.style.transform = `translateX(${clamp(x, 0, this.rect.width)}px)`;

    if (trigger && this.opts.change) this.opts.change(value);
  }
}
