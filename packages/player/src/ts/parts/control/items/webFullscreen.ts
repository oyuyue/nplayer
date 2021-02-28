import { icons } from 'src/ts/icons';
import { Component, hide } from 'src/ts/utils';
import { ControlTip } from './helper';

export class WebFullscreenControlItem extends Component {
  private readonly exitIcon: HTMLElement;

  private readonly enterIcon: HTMLElement;

  private readonly tip: ControlTip;

  constructor(container: HTMLElement) {
    super(container);
    this.tip = new ControlTip(this.element, '网页全屏');
    this.enterIcon = this.element.appendChild(icons.webEnterFullscreen());
    this.exitIcon = this.element.appendChild(icons.webExitFullscreen());

    hide(this.exitIcon);
  }
}
