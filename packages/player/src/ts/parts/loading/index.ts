import { Component } from 'src/ts/component';

export class Loading extends Component {
  constructor(container: HTMLElement) {
    super(container, '.loading', undefined, '<div></div><div></div><div></div><div></div>');
  }
}
