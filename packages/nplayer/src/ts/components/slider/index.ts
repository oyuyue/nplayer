import {
  $, addDisposable, addDisposableListener, clamp, Component, Drag, Rect,
} from 'src/ts/utils';

export interface SliderOption {
  value?: number;
  stops?: { value: number, html?: string }[];
  change?: (value: number) => void;
  step?: boolean;
}

export class Slider extends Component {
  private readonly trackEl: HTMLElement;

  private readonly dotEl: HTMLElement;

  private readonly step: boolean | undefined;

  readonly rect: Rect;

  constructor(container: HTMLElement, private opts: SliderOption) {
    super(container, '.slider');

    this.rect = new Rect(this.el);

    this.trackEl = this.el.appendChild($('.slider_track')).appendChild($('.slider_track_inner'));
    if (opts.stops) {
      let stop;
      opts.stops.forEach((s) => {
        stop = $('.slider_stop', undefined, s.html ? `<span>${s.html}</span>` : '');
        stop.style.left = `${s.value * 100}%`;
        this.el.appendChild(stop);
      });
    }
    this.dotEl = this.el.appendChild($('.slider_dot'));

    addDisposable(this, new Drag(this.el, (ev: PointerEvent) => {
      this.rect.update();
      this.onDrag(ev);
    }, this.onDrag));
    addDisposableListener(this, this.el, 'touchstart', (ev: Event) => ev.preventDefault());

    this.step = opts.stops && opts.step;

    this.update(opts.value || 0, undefined, false);
  }

  private onDrag = (ev: PointerEvent) => {
    const isHeightGtWidth = this.rect.isHeightGtWidth;
    const x = isHeightGtWidth ? (ev.clientY - this.rect.y) : (ev.clientX - this.rect.x);
    this.update(x / (isHeightGtWidth ? this.rect.height : this.rect.width), x);
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

    const w = this.rect.isHeightGtWidth ? this.rect.height : this.rect.width;
    x = x != null ? x : value * w;
    this.trackEl.style.transform = `scaleX(${clamp(value)})`;
    this.dotEl.style.transform = `translateX(${clamp(x, 0, w)}px)`;

    if (trigger && this.opts.change) this.opts.change(value);
  }
}
