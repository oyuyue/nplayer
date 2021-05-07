import {
  addClass, Component, hide, removeClass, show,
} from 'src/ts/utils';

const classLeft = 'tooltip-left';
const classRight = 'tooltip-right';
const classBottom = 'tooltip-bottom';

export class Tooltip extends Component {
  constructor(container: HTMLElement, html?: string) {
    super(container, '.tooltip_content');
    addClass(container, 'tooltip');
    if (html) this.html = html;
  }

  get html(): string {
    return this.el.innerHTML;
  }

  set html(v: string) {
    this.el.innerHTML = v;
  }

  resetPos(): void {
    removeClass(this.el, classLeft);
    removeClass(this.el, classRight);
    removeClass(this.el, classBottom);
  }

  setBottom(): void {
    addClass(this.el, classBottom);
  }

  setLeft(): void {
    addClass(this.el, classLeft);
  }

  setRight(): void {
    addClass(this.el, classRight);
  }

  hide(): void {
    hide(this.el);
  }

  show(): void {
    show(this.el);
  }
}
