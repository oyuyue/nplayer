import {
  addDisposableListener, Component, containClass, toggleClass,
} from 'src/ts/utils';

const activeClass = 'switch-active';
export class Switch extends Component {
  constructor(container: HTMLElement, value?: boolean, change?: (v: boolean) => void) {
    super(container, '.switch');
    this.toggle(value || false);

    if (change) {
      addDisposableListener(this, this.element, 'click', () => {
        this.toggle();
        change(containClass(this.element, activeClass));
      });
    }
  }

  toggle(value?: boolean): void {
    toggleClass(this.element, activeClass, value);
  }
}
