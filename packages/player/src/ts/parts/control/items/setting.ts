import { icons } from 'src/ts/icons';
import { Component } from 'src/ts/utils';
import { ControlTip } from './helper';

export class SettingControlItem extends Component {
  private readonly icon: HTMLElement;

  private readonly tip: ControlTip;

  constructor(container: HTMLElement) {
    super(container);
    this.tip = new ControlTip(this.element, '设置');
    this.icon = this.element.appendChild(icons.cog());
  }
}
