import {
  addClass, Component, hide, show,
} from 'src/ts/utils';

const classLeft = 'control_tip-left';
const classRight = 'control_tip-right';

export class ControlTip extends Component {
  constructor(container: HTMLElement, html?: string) {
    super(container, '.control_tip');
    addClass(container, 'control_tip_wrapper');
    if (html) this.html = html;
  }

  get html(): string {
    return this.element.innerHTML;
  }

  set html(v: string) {
    this.element.innerHTML = v;
  }

  setLeft(): void {
    addClass(this.element, classLeft);
  }

  setRight(): void {
    addClass(this.element, classRight);
  }

  hide(): void {
    hide(this.element);
  }

  show(): void {
    show(this.element);
  }
}
