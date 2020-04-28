import EventHandler from './event-handler';
import RPlayer from './rplayer';
import { isStr } from './utils';

class Component extends EventHandler {
  private _rect: DOMRect;
  dom: HTMLElement;

  constructor(
    player?: RPlayer,
    dom: string | HTMLElement = 'div',
    ...events: string[]
  ) {
    super(player, ...events);
    if (typeof dom === 'string') {
      this.dom = document.createElement(dom);
    } else {
      this.dom = dom;
    }
  }

  get rect(): DOMRect {
    if (this._rect) return this._rect;
    this._rect = this.dom.getBoundingClientRect();
    return this._rect;
  }

  addStyle(style: Partial<CSSStyleDeclaration> | string): this {
    if (isStr(style)) {
      this.dom.style.cssText = style;
    } else {
      Object.keys(style).forEach((k) => {
        this.dom.style[k as any] = style[k as any];
      });
    }

    return this;
  }

  appendChild(d: HTMLElement | Component): this {
    this.dom.appendChild(Component.isComponent(d) ? d.dom : d);
    return this;
  }

  removeChild(d: HTMLElement | Component): this {
    this.dom.removeChild(Component.isComponent(d) ? d.dom : d);
    return this;
  }

  addClass(cls: string): this {
    this.dom.classList.add(...cls.split(' '));
    return this;
  }

  toggleClass(cls: string, force?: boolean): this {
    this.dom.classList.toggle(cls, force);
    return this;
  }

  removeClass(cls: string): this {
    this.dom.classList.remove(cls);
    return this;
  }

  appendTo(d: HTMLElement | Component): this {
    d.appendChild(this.dom);
    return this;
  }

  removeFrom(d: HTMLElement | Component): this {
    d.removeChild(this.dom);
    return this;
  }

  removeFromParent(): this {
    this.dom.parentNode.removeChild(this.dom);
    return this;
  }

  static isComponent(obj: unknown): obj is Component {
    return obj instanceof Component;
  }
}

export default Component;
