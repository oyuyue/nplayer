import { Component } from 'src/ts/component';
import { $ } from '../../utils';
import { ControlBar } from './items';

export class Control extends Component {
  private readonly bgElement: HTMLElement;

  constructor(container: HTMLElement) {
    super(container, '.control');
    this.bgElement = container.appendChild($('.control_bg'));
    new ControlBar(this.element);
  }
}
