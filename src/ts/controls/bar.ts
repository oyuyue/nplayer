import Component from '../component';
import { clamp } from '../utils';

class Bar extends Component {
  private x: number;

  constructor(
    className?: string,
    style?: Partial<CSSStyleDeclaration> | string
  ) {
    super();

    this.addClass('rplayer_bar');
    if (className) this.addClass(className);
    if (style) this.addStyle(style);
  }

  set(x?: number): this {
    if (this.x === x) return;
    this.x = clamp(x);
    this.addStyle({ transform: `scaleX(${this.x})` });
    return this;
  }

  get(): number {
    return this.x;
  }
}

export default Bar;
