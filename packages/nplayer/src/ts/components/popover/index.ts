import {
  $, addClass, addDisposableListener, Component, getEventPath, removeClass,
} from 'src/ts/utils';

const classActive = 'popover-active';
const classBottom = 'popover_panel-bottom';
export class Popover extends Component {
  readonly panelEl: HTMLElement;

  readonly maskEl: HTMLElement;

  constructor(
    container: HTMLElement,
    private readonly onHide?: (ev?: MouseEvent) => void,
    style?: Partial<CSSStyleDeclaration>,
    left?: boolean,
  ) {
    super(container, '.popover');
    this.maskEl = this.el.appendChild($('.popover_mask'));
    this.panelEl = this.el.appendChild($('.popover_panel'));

    if (style) this.applyPanelStyle(style);

    if (left) addClass(this.panelEl, 'popover_panel-left');

    addDisposableListener(this, this.maskEl, 'click', (ev: MouseEvent) => {
      ev.stopPropagation();
      if (getEventPath(ev).includes(this.panelEl)) return;
      this.hide(ev);
    });
  }

  resetPos() {
    removeClass(this.panelEl, classBottom);
  }

  setBottom() {
    addClass(this.panelEl, classBottom);
  }

  applyPanelStyle(style: Partial<CSSStyleDeclaration>): void {
    Object.assign(this.panelEl.style, style);
  }

  show() {
    addClass(this.el, classActive);
  }

  hide(ev?: MouseEvent) {
    removeClass(this.el, classActive);
    if (this.onHide) this.onHide(ev);
  }
}
