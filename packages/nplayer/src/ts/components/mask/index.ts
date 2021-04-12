import {
  addDisposableListener, Component, hide, show,
} from 'src/ts/utils';

export class Mask extends Component {
  constructor(container: HTMLElement, click?: (e: MouseEvent) => void, style?: Partial<CSSStyleDeclaration>) {
    super(container, '.mask');
    if (style) this.applyStyle(style);
    if (click) addDisposableListener(this, this.element, 'click', click, true);
    this.hide();
  }

  show(): void {
    show(this.element);
  }

  hide(): void {
    hide(this.element);
  }
}
