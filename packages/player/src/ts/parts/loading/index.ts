import { Component } from 'src/ts/utils';

export class Loading extends Component {
  constructor(container: HTMLElement) {
    super(container, '.loading', undefined, '<div></div><div></div><div></div><div></div>');
  }
}
