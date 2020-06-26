import { newElement, isStr, clamp, getDomOr } from '../utils';

export interface TrayOptions {
  el?: string | HTMLElement;
  label?: string;
  labelPos?: 'left' | 'right';
  icons?: (Element | string)[];
  noHoverBg?: boolean;
  onClick?: (i: number, ev: MouseEvent) => any;
}

export default class Tray {
  private static readonly disableCls = 'rplayer_tray-disable';
  readonly dom: HTMLElement;
  readonly tip: HTMLElement;
  private readonly icons: HTMLElement[] = [];
  private index = 0;
  private readonly onClick: TrayOptions['onClick'];

  constructor(opts: TrayOptions = {}) {
    this.dom = newElement('rplayer_tray');
    this.tip = newElement('rplayer_tray_tip');
    this.onClick = opts.onClick;

    if (opts.label) {
      this.tip.innerHTML = opts.label;
    } else {
      this.hideTip();
    }

    if (opts.labelPos === 'left') {
      this.tip.classList.add('rplayer_tray_tip-l');
    } else if (opts.labelPos === 'right') {
      this.tip.classList.add('rplayer_tray_tip-r');
    }

    if (opts.noHoverBg) {
      this.dom.classList.add('rplayer_tray-nobg');
    }

    this.dom.appendChild(this.tip);
    if (Array.isArray(opts.icons)) {
      opts.icons.forEach((icon) => {
        const span = newElement('rplayer_tray_icon', 'span');
        if (isStr(icon)) {
          span.innerHTML = icon;
        } else {
          span.appendChild(icon);
        }
        this.icons.push(span);
        this.dom.appendChild(span);
      });
    }

    this.dom.addEventListener('click', this.clickHandler);

    this.showIcon();

    if (opts.el) this.mount(opts.el);
  }

  private clickHandler = (ev: MouseEvent): void => {
    ev.preventDefault();
    ev.stopPropagation();
    if (this.onClick) this.onClick(this.index, ev);
  };

  enable(): void {
    this.dom.classList.remove(Tray.disableCls);
  }

  disable(): void {
    this.dom.classList.add(Tray.disableCls);
  }

  changeTip(tip: string): void {
    this.tip.innerHTML = tip;
    this.showTip();
  }

  hideTip(): void {
    this.tip.hidden = true;
  }

  showTip(): void {
    this.tip.hidden = false;
  }

  showIcon(i = 0): void {
    i = clamp(i, 0, this.icons.length - 1);
    this.icons.forEach((icon) => {
      icon.hidden = true;
    });
    this.icons[i].hidden = false;
    this.index = i;
  }

  mount(el?: string | HTMLElement): void {
    getDomOr(el, document.body).appendChild(this.dom);
  }

  destroy(): void {
    this.dom.removeEventListener('click', this.clickHandler);
    if (this.dom.parentNode) {
      this.dom.parentNode.removeChild(this.dom);
    }
  }
}
