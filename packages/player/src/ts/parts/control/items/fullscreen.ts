import { Component } from 'src/ts/component';
import { icons } from 'src/ts/icons';
import { hide } from 'src/ts/utils';
import { ControlTip } from './helper';

export class FullscreenControlItem extends Component {
  private readonly exitIcon: HTMLElement;

  private readonly enterIcon: HTMLElement;

  private readonly tip: ControlTip;

  constructor(container: HTMLElement) {
    super(container);
    this.tip = new ControlTip(this.element, '全屏');
    this.exitIcon = this.element.appendChild(icons.exitFullscreen());
    this.enterIcon = this.element.appendChild(icons.enterFullscreen());

    hide(this.exitIcon);
  }
}
