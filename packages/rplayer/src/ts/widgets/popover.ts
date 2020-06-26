import { newElement, getDomOr } from '../utils';

export interface PopoverOptions {
  el?: string | HTMLElement;
  left?: boolean;
}

export default class Popover {
  private static readonly activeCls = 'rplayer_pop-active';
  readonly dom: HTMLElement;

  constructor(opts: PopoverOptions = {}) {
    this.dom = newElement('rplayer_pop');

    if (opts.left) {
      this.dom.style.right = 'auto';
      this.dom.style.left = '0px';
    }

    if (opts.el) this.mount(opts.el);
  }

  show(): void {
    this.dom.classList.add(Popover.activeCls);
  }

  hide(): void {
    this.dom.classList.remove(Popover.activeCls);
  }

  mount(el?: string | HTMLElement): void {
    getDomOr(el, document.body).appendChild(this.dom);
  }
}
