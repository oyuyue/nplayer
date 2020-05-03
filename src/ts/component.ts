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

  get text(): string {
    return this.dom.innerText;
  }

  set text(text: string) {
    this.dom.innerText = text;
  }

  get html(): string {
    return this.dom.innerHTML;
  }

  set html(html: string) {
    this.dom.innerHTML = html;
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

  appendChild(d: Node | Component): this {
    this.dom.appendChild(Component.isComponent(d) ? d.dom : d);
    return this;
  }

  insert(d: Node | Component, pos?: number): this {
    this.dom.insertBefore(
      Component.isComponent(d) ? d.dom : d,
      this.dom.children[pos]
    );
    return this;
  }

  removeChild(d: Node | Component): this {
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

  appendTo(d: Node | Component): this {
    d.appendChild(this.dom);
    return this;
  }

  removeFrom(d: Node | Component): this {
    d.removeChild(this.dom);
    return this;
  }

  removeFromParent(): this {
    this.dom.parentNode.removeChild(this.dom);
    return this;
  }

  hidden(): this {
    this.dom.hidden = true;
    return this;
  }

  visible(): this {
    this.dom.hidden = false;
    return this;
  }

  static isComponent(obj: unknown): obj is Component {
    return obj instanceof Component;
  }
}

export default Component;
