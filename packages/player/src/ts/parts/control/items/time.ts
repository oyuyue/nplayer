import { Component } from 'src/ts/component';

export class TimeControlItem extends Component {
  constructor(container: HTMLElement) {
    super(container);
    this.element.innerText = '0:0 / 0:0';
  }
}
