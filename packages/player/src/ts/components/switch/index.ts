import { Component, toggleClass } from 'src/ts/utils';

const activeClass = 'switch-active';
export class Switch extends Component {
  constructor(container: HTMLElement, value?: boolean) {
    super(container, '.switch');
    this.toggle(value || false);
  }

  toggle(value?: boolean): void {
    toggleClass(this.element, activeClass, value);
  }
}
