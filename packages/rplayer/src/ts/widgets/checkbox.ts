import { newElement, getDomOr } from '../utils';

export interface CheckboxOptions {
  defaultValue?: boolean;
  el?: string | HTMLElement;
  onChange?: (value: boolean, done: (success?: boolean) => any) => any;
  label?: string;
  primaryColor?: string;
}

export default class Checkbox {
  private static readonly activeCls = 'rplayer_checkbox-active';
  readonly dom: HTMLElement;
  private _value = false;
  private onChange: CheckboxOptions['onChange'];
  private color: string;

  constructor(opts: CheckboxOptions = {}) {
    this._value = opts.defaultValue;
    this.onChange = opts.onChange;
    this.color = opts.primaryColor;
    this.dom = newElement('rplayer_checkbox');
    if (opts.label) this.dom.innerHTML = opts.label;

    this.dom.addEventListener('click', this.clickHandler);
  }

  get value(): boolean {
    return this._value;
  }

  set value(v: boolean) {
    this.update(v);
  }

  private clickHandler = (ev: MouseEvent): void => {
    ev.preventDefault();
    this.update(!this._value);
    if (this.onChange) this.onChange(this._value, this.done);
  };

  private done(success?: boolean): void {
    if (!success) {
      this._value = !this._value;
      this.update();
    }
  }

  update(v = this._value): void {
    this._value = v;
    if (v) {
      this.dom.classList.add(Checkbox.activeCls);
      if (this.color) {
        this.dom.style.color = this.color;
      }
    } else {
      this.dom.classList.remove(Checkbox.activeCls);
      this.dom.style.color = '';
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
