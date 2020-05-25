import Component from '../../component';
import {
  TOOLTIP,
  TOOLTIP_TEXT,
  TOOLTIP_TEXT_LEFT,
  TOOLTIP_TEXT_RIGHT,
  TRAY,
} from '../../config/classname';
import RPlayer from '../../rplayer';
import { newElement, isStr, htmlDom } from '../../utils';

export interface TrayOpts {
  text?: string;
  icon?: string | Element;
  pos?: number;
  init?: (tray: Tray, player: RPlayer) => any;
  onClick?: (ev: MouseEvent) => any;
}

export default abstract class Tray extends Component {
  protected readonly tip = newElement(TOOLTIP_TEXT);
  pos = 0;

  constructor(player?: RPlayer, tipText = '', ...events: string[]) {
    super(player, {
      events,
      className: TOOLTIP + ' ' + TRAY,
    });

    this.changeTipText(tipText);
    this.dom.addEventListener('click', this.__onclick);
    this.appendChild(this.tip);
  }

  private __onclick = (ev: MouseEvent): void => {
    ev.preventDefault();
    this.onClick(ev);
  };

  abstract onClick(ev?: MouseEvent): any;

  setLeft(): void {
    this.tip.classList.add(TOOLTIP_TEXT_LEFT);
  }

  setRight(): void {
    this.tip.classList.add(TOOLTIP_TEXT_RIGHT);
  }

  changeTipText(text: string): void {
    this.tip.innerText = text;
  }
}

export class ConfigTray extends Tray {
  private readonly clickHandler: TrayOpts['onClick'];

  constructor(opts: TrayOpts, player: RPlayer) {
    super(player, opts.text);
    if (opts.icon) {
      this.appendChild(isStr(opts.icon) ? htmlDom(opts.icon) : opts.icon);
    }
    if (opts.init) opts.init(this, player);
    if (opts.pos) this.pos = opts.pos;
  }

  onClick(ev: MouseEvent): void {
    if (this.clickHandler) this.clickHandler(ev);
  }
}
