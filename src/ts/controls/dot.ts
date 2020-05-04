import Component from '../component';

class Dot extends Component {
  constructor(
    className?: string,
    style?: Partial<CSSStyleDeclaration> | string
  ) {
    super();

    this.addClass('rplayer_dot');
    if (className) this.addClass(className);
    if (style) this.addStyle(style);
  }

  setX(x: number): void {
    this.addStyle({ transform: `translateX(${x}px)` });
  }
}

export default Dot;
