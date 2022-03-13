import {
  addClass, Component, hide, removeClass, show,
} from '../../utils';
import './index.scss';

const classLeft = 'tip-l';
const classRight = 'tip-r';
const classBottom = 'tip-b';

export class Tooltip extends Component {
  constructor(container: HTMLElement, html?: string) {
    super(container, '.tip_text');
    addClass(container, 'tip');
    if (html) this.html = html;
  }

  get html() {
    return this.el.innerHTML;
  }

  set html(v: string) {
    this.el.innerHTML = v;
  }

  get text() {
    return this.el.textContent;
  }

  set text(v: string | null) {
    this.el.textContent = v;
  }

  reset() {
    removeClass(this.el, classLeft);
    removeClass(this.el, classRight);
    removeClass(this.el, classBottom);
  }

  bottom() {
    addClass(this.el, classBottom);
  }

  left() {
    addClass(this.el, classLeft);
  }

  right() {
    addClass(this.el, classRight);
  }

  hide() {
    hide(this.el);
  }

  show() {
    show(this.el);
  }
}
