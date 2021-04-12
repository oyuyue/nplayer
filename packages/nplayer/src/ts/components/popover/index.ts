import {
  $, addClass, addDisposableListener, Component, getEventPath, removeClass,
} from 'src/ts/utils';

const classActive = 'popover-active';

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
    this.maskElement = this.element.appendChild($('.popover_mask'));
    this.panelElement = this.element.appendChild($('.popover_panel'));

    if (style) this.applyPanelStyle(style);

    if (left) addClass(this.panelElement, 'popover_panel-left');

    addDisposableListener(this, this.maskElement, 'click', (ev: MouseEvent) => {
      ev.stopPropagation();
      if (getEventPath(ev).includes(this.panelElement)) return;
      this.hide(ev);
    });
  }

  applyPanelStyle(style: Partial<CSSStyleDeclaration>): void {
    Object.assign(this.panelElement.style, style);
  }

  show() {
    addClass(this.element, classActive);
  }

  hide(ev?: MouseEvent) {
    removeClass(this.element, classActive);
    if (this.onHide) this.onHide(ev);
  }
}
