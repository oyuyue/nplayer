import { newElement, isStr } from '../../utils';

export interface BaseItemOptions {
  onClick?: (ev: MouseEvent) => any;
  noHoverBg?: boolean;
  cls?: string;
}

export default class BaseItem {
  readonly dom: HTMLElement;
  private onClick: BaseItemOptions['onClick'];

  constructor(opts: BaseItemOptions = {}) {
    this.dom = newElement('rplayer_setting_item');
    this.onClick = opts.onClick;

    if (opts.noHoverBg) {
      this.dom.classList.add('rplayer_setting_item-nobg');
    }

    if (opts.cls) {
      this.dom.classList.add(opts.cls);
    }

    this.dom.addEventListener('click', this.clickHandler);
  }

  private clickHandler = (ev: MouseEvent): void => {
    ev.preventDefault();
    ev.stopPropagation();
    if (this.onClick) this.onClick(ev);
  };

  append(e: Element | string): void {
    if (isStr(e)) {
      this.dom.innerHTML = e;
    } else {
      this.dom.appendChild(e);
    }
  }

  destroy(): void {
    this.dom.removeEventListener('click', this.clickHandler);
    if (this.dom.parentNode) {
      this.dom.parentNode.removeChild(this.dom);
    }
  }
}
