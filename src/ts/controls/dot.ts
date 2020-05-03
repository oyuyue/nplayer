import Component from '../component';

class Dot extends Component {
  private x = 0;

  constructor(
    className?: string,
    style?: Partial<CSSStyleDeclaration> | string
  ) {
    super();

    this.addClass('rplayer_dot');
    if (className) this.addClass(className);
    if (style) this.addStyle(style);
  }

  setX(x: number): this {
    if (this.x === x) return;
    this.x = x;
    this.addStyle({ transform: `translateX(${x}px)` });
    return this;
  }

  getX(): number {
    return this.x;
  }
}

export default Dot;
