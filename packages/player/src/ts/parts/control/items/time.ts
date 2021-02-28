import { Component } from 'src/ts/utils';

export class TimeControlItem extends Component {
  constructor(container: HTMLElement) {
    super(container);
    this.element.innerText = '0:0 / 0:0';
  }
}
