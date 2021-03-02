import { Component, toggleClass } from 'src/ts/utils';

const activeClass = 'switch-active';
export class Switch extends Component {
  constructor(container: HTMLElement) {
    super(container, '.switch');
  }

  toggle(value: boolean): void {
    toggleClass(this.element, activeClass, value);
  }
}
