import {
  $, addClass, addDisposableListener, Component, getEventPath, removeClass,
} from 'src/ts/utils';

const classActive = 'popover-active';
const classBottom = 'popover_panel-bottom';
export class Popover extends Component {
  readonly panelElement: HTMLElement;

  readonly maskElement: HTMLElement;

  constructor(
    container: HTMLElement,
    private readonly onHide?: (ev?: MouseEvent) => void,
    style?: Partial<CSSStyleDeclaration>,
    left?: boolean,
  ) {
    super(container, '.popover');
    this.maskElement = this.el.appendChild($('.popover_mask'));
    this.panelElement = this.el.appendChild($('.popover_panel'));

    if (style) this.applyPanelStyle(style);

    if (left) addClass(this.panelElement, 'popover_panel-left');

    addDisposableListener(this, this.maskElement, 'click', (ev: MouseEvent) => {
      ev.stopPropagation();
      if (getEventPath(ev).includes(this.panelElement)) return;
      this.hide(ev);
    });
  }

  resetPos() {
    removeClass(this.panelElement, classBottom);
  }

  setBottom() {
    addClass(this.panelElement, classBottom);
  }

  applyPanelStyle(style: Partial<CSSStyleDeclaration>): void {
    Object.assign(this.panelElement.style, style);
  }

  show() {
    addClass(this.el, classActive);
  }

  hide(ev?: MouseEvent) {
    removeClass(this.el, classActive);
    if (this.onHide) this.onHide(ev);
  }
}
