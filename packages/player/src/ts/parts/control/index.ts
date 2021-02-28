import { $, Component } from '../../utils';
import { ControlBar } from './items';
import { Progress } from './progress';

export class Control extends Component {
  private readonly bgElement: HTMLElement;

  constructor(container: HTMLElement) {
    super(container, '.control');
    this.bgElement = container.appendChild($('.control_bg'));
    new Progress(this.element);
    new ControlBar(this.element);
  }
}
