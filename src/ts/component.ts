import EventHandler from './event-handler';
import Events from './events';
import RPlayer from './rplayer';
import { isStr, newElement } from './utils';

export interface ComponentOptions {
  player?: RPlayer;
  dom?: keyof HTMLElementTagNameMap | HTMLElement;
  events?: string[];
  autoUpdateRect?: boolean;
  className?: string;
}

export default class Component extends EventHandler {
  protected _rect: DOMRect;
  readonly dom: HTMLElement;

  constructor(
    player?: RPlayer,
    {
      dom = 'div',
      events,
      autoUpdateRect = false,
      className,
    }: ComponentOptions = {}
  ) {
    super(player, events);

    this.dom = isStr(dom) ? newElement('', dom) : dom;

    if (className) this.addClass(className);

    if (player && autoUpdateRect) {
      this.autoUpdateRect();
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

  private _resizeHandler = (): void => {
    this.updateRect();
  };

  autoUpdateRect(player = this.player): void {
    player.on(Events.PLAYER_RESIZE, this._resizeHandler);
  }

  updateRect = (): void => {
    this._rect = this.dom.getBoundingClientRect();
  };

  addStyle(style: Partial<CSSStyleDeclaration> | string): void {
    if (isStr(style)) {
      this.dom.style.cssText = style;
    } else {
      Object.keys(style).forEach((k) => {
        this.dom.style[k as any] = style[k as any];
      });
    }
  }

  appendChild(d: Node | Component): void {
    this.dom.appendChild(Component.isComponent(d) ? d.dom : d);
  }

  insert(d: Node | Component, pos?: number): void {
    this.dom.insertBefore(
      Component.isComponent(d) ? d.dom : d,
      this.dom.children[pos]
    );
  }

  removeChild(d: Node | Component): void {
    this.dom.removeChild(Component.isComponent(d) ? d.dom : d);
  }

  addClass(cls: string): void {
    cls.split(' ').forEach((c) => {
      this.dom.classList.add(c);
    });
  }

  containsClass(cls: string): boolean {
    return this.dom.classList.contains(cls);
  }

  toggleClass(cls: string, force?: boolean): void {
    this.dom.classList.toggle(cls, force);
  }

  removeClass(cls: string): void {
    this.dom.classList.remove(cls);
  }

  appendTo(d: Node | Component): void {
    d.appendChild(this.dom);
  }

  removeFrom(d: Node | Component): void {
    d.removeChild(this.dom);
  }

  removeFromParent(): void {
    this.dom.parentNode.removeChild(this.dom);
  }

  hidden(): void {
    this.dom.hidden = true;
  }

  visible(): void {
    this.dom.hidden = false;
  }

  canFocus(): void {
    this.dom.setAttribute('tabindex', '0');
  }

  static isComponent(obj: unknown): obj is Component {
    return obj instanceof Component;
  }
}
