import { newElement, Drag, clamp, getDomOr, isBool } from '../utils';

export interface SliderOptions {
  defaultValue?: number;
  onChange?: (value: number, done: (success?: boolean) => any) => any;
  map?: (value: number) => any;
  tip?: boolean;
  el?: string | HTMLElement;
  stop?: boolean;
  stops?: { value: number; label: string }[];
  primaryColor?: string;
  bgColor?: string;
  labelColor?: string;
  barHeight?: number;
}

export default class Slider {
  readonly dom: HTMLElement;
  private readonly dot: HTMLElement;
  private readonly bar: HTMLElement;
  private readonly tip: HTMLElement;
  private readonly drag: Drag;
  private readonly stops: SliderOptions['stops'];
  private _rect: DOMRect;
  private prevValue = 0;
  private readonly onChange: SliderOptions['onChange'];
  private readonly map: SliderOptions['map'];
  private showTip = false;
  private _value = 0;
  private hdw = 0;

  constructor(opts: SliderOptions = {}) {
    this.showTip = opts.tip;
    this.onChange = opts.onChange;
    this.map = opts.map;
    this._value = opts.defaultValue || 0;
    this.prevValue = this._value;

    if (!isBool(opts.tip) && !opts.stop) {
      this.showTip = true;
    }

    this.dom = newElement('rplayer_slider');
    const barWrapper = newElement('rplayer_slider_wrap');
    this.bar = newElement('rplayer_slider_bar');
    this.dot = newElement('rplayer_slider_dot');
    this.tip = newElement('rplayer_slider_tip');

    barWrapper.appendChild(this.bar);
    this.dom.appendChild(barWrapper);

    if (Array.isArray(opts.stops) && opts.stops.length) {
      opts.stops.forEach((s) => {
        const stop = newElement('rplayer_slider_stop');
        stop.innerHTML = s.label;
        stop.style.left = s.value * 100 + '%';
        if (opts.bgColor) stop.style.background = opts.bgColor;
        if (opts.labelColor) stop.style.color = opts.labelColor;
        this.dom.appendChild(stop);
      });

      if (opts.stop) this.stops = opts.stops;
    }

    this.dom.appendChild(this.dot);
    this.dom.appendChild(this.tip);

    if (opts.barHeight) {
      barWrapper.style.height = opts.barHeight + 'px';
      const size = opts.barHeight * 2 + 'px';
      this.dot.style.width = size;
      this.dot.style.height = size;
    }

    if (opts.primaryColor) {
      this.dot.style.background = opts.primaryColor;
      this.bar.style.background = opts.primaryColor;
    }

    if (opts.bgColor) {
      barWrapper.style.background = opts.bgColor;
    }

    if (!this.showTip) {
      this.tip.hidden = true;
    }

    this.drag = new Drag(
      this.dom,
      this.dragStartHandler,
      this.dragHandler,
      this.dragEndHandler
    );

    if (opts.el) {
      this.mount(opts.el);
    }
  }

  private get halfDotW(): number {
    if (this.hdw) this.hdw;
    this.hdw = this.dot.getBoundingClientRect().width / 2;
    return this.hdw;
  }

  get rect(): DOMRect {
    if (this._rect) return this._rect;
    const rect = this.dom.getBoundingClientRect();
    if (rect.width) this._rect = rect;
    return rect;
  }

  get mapped(): any {
    if (this.map) return this.map(this._value);
    return Math.round(this._value * 100) + '%';
  }

  get value(): number {
    return this._value;
  }

  set value(v: number) {
    this.update(v);
  }

  private dragStartHandler = (ev: PointerEvent): void => {
    this.dragHandler(ev);
  };

  private dragHandler = (ev: PointerEvent): void => {
    const x = clamp(ev.pageX - this.rect.left, 0, this.rect.width);
    const p = x / this.rect.width;
    if (this.stops) {
      let closed = Infinity;
      let v = 0;
      this.stops.forEach((s) => {
        const c = Math.abs(p - s.value);
        if (c < closed) {
          closed = c;
          v = s.value;
        }
      });
      this._value = v;
      this.updateDom();
    } else {
      this._value = p;
      this.updateDom(x);
    }
  };

  private dragEndHandler = (): void => {
    if (this.onChange) this.onChange(this._value, this.done);
  };

  private done = (success?: boolean): void => {
    if (success) {
      this.prevValue = this._value;
    } else {
      this._value = this.prevValue;
      this.updateDom();
    }
  };

  private updateDom(x?: number): void {
    if (!x) x = this._value * this.rect.width;
    this.bar.style.transform = `scaleX(${this._value})`;
    const l = clamp(x, this.halfDotW, this.rect.width - this.halfDotW) + 'px';
    this.dot.style.left = l;

    if (this.showTip) {
      this.tip.innerHTML = this.mapped;
      this.tip.style.left = l;
    }
  }

  updateRect(): void {
    this._rect = null;
    this.hdw = 0;
  }

  update(v = this._value): void {
    v = clamp(v);
    this._value = v;
    this.prevValue = v;
    this.updateDom();
  }

  mount(el?: string | HTMLElement): void {
    getDomOr(el, document.body).appendChild(this.dom);
    requestAnimationFrame(() => this.update());
  }

  destroy(): void {
    this.drag.destroy();
    if (this.dom.parentNode) {
      this.dom.parentNode.removeChild(this.dom);
    }
  }
}
