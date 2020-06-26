import { newElement, getDomOr, isBool } from '../utils';

export interface SwitchOptions {
  defaultValue?: boolean;
  el?: string | HTMLElement;
  onChange?: (value: boolean, done: (success?: boolean) => any) => any;
  primaryColor?: string;
  small?: boolean;
}

export default class Switch {
  private static readonly activeCls = 'rplayer_switch-active';
  readonly dom: HTMLElement;
  private _value = false;
  private readonly color: string;
  private readonly onChange: SwitchOptions['onChange'];

  constructor(opts: SwitchOptions = {}) {
    this._value = opts.defaultValue;
    this.onChange = opts.onChange;
    this.color = opts.primaryColor;

    this.dom = newElement('rplayer_switch');
    if (opts.small) this.dom.classList.add('rplayer_switch-small');

    this.dom.addEventListener('click', this.clickHandler);

    if (opts.el) {
      this.mount(opts.el);
    }
  }

  get value(): boolean {
    return this._value;
  }

  set value(v: boolean) {
    this.update(v);
  }

  private clickHandler = (ev: MouseEvent): void => {
    ev.preventDefault();
    if (!this.onChange) return;
    this.update(!this._value);
    this.onChange(this._value, this.done);
  };

  private done = (success?: boolean): void => {
    if (!success) {
      this._value = !this._value;
      this.update();
    }
  };

  update(v?: boolean): void {
    if (isBool(v)) this._value = v;
    if (this._value) {
      this.dom.classList.add(Switch.activeCls);
      if (this.color) this.dom.style.background = this.color;
    } else {
      this.dom.classList.remove(Switch.activeCls);
      this.dom.style.background = '';
    }
  }

  mount(el?: string | HTMLElement): void {
    getDomOr(el, document.body).appendChild(this.dom);
    requestAnimationFrame(() => this.update());
  }

  destroy(): void {
    this.dom.removeEventListener('click', this.clickHandler);
    if (this.dom.parentNode) {
      this.dom.parentNode.removeChild(this.dom);
    }
  }
}
