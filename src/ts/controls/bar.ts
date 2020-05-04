import Component from '../component';
import { clamp } from '../utils';

class Bar extends Component {
  constructor(
    className?: string,
    style?: Partial<CSSStyleDeclaration> | string
  ) {
    super();

    this.addClass('rplayer_bar');
    if (className) this.addClass(className);
    if (style) this.addStyle(style);
  }

  setX(x: number): void {
    this.addStyle({ transform: `scaleX(${clamp(x)})` });
  }
}

export default Bar;
