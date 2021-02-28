import { addClass, Component } from 'src/ts/utils';

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
}
