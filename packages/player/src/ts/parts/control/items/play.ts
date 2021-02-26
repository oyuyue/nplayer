import { hide } from 'src/ts/utils';
import { icons } from 'src/ts/icons';
import { Component } from 'src/ts/component';
import { ControlTip } from './helper';

export class PlayControlItem extends Component {
  private playIcon!: HTMLElement;

  private pauseIcon!: HTMLElement;

  private readonly tip: ControlTip;

  constructor(container: HTMLElement) {
    super(container);
    this.tip = new ControlTip(this.element, '播放');
    this.playIcon = this.element.appendChild(icons.play());
    this.pauseIcon = this.element.appendChild(icons.pause());
    hide(this.pauseIcon);
  }
}
