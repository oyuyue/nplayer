import {
  addDisposableListener, Component, containClass, toggleClass,
} from 'src/ts/utils';

const activeClass = 'switch-active';
export class Switch extends Component {
  constructor(container: HTMLElement, value?: boolean, change?: (v: boolean) => void) {
    super(container, '.switch');
    this.toggle(value || false);

    if (change) {
      addDisposableListener(this, this.el, 'click', () => {
        this.toggle();
        change(containClass(this.el, activeClass));
      });
    }
  }

  toggle(value?: boolean): void {
    toggleClass(this.el, activeClass, value);
  }
}
