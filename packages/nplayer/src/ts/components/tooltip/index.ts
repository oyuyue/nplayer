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
    return this.element.innerHTML;
  }

  set html(v: string) {
    this.element.innerHTML = v;
  }

  resetPos(): void {
    removeClass(this.element, classLeft);
    removeClass(this.element, classRight);
    removeClass(this.element, classBottom);
  }

  setBottom(): void {
    addClass(this.element, classBottom);
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
