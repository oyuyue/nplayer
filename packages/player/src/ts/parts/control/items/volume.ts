import { Component } from 'src/ts/component';
import { icons } from 'src/ts/icons';
import { hide } from 'src/ts/utils';
import { ControlTip } from './helper';

export class VolumeControlItem extends Component {
  private readonly volumeIcon: HTMLElement;

  private readonly mutedIcon: HTMLElement;

  private readonly tip: ControlTip;

  constructor(container: HTMLElement) {
    super(container);
    this.tip = new ControlTip(this.element, '静音');
    this.volumeIcon = this.element.appendChild(icons.volume());
    this.mutedIcon = this.element.appendChild(icons.muted());
    hide(this.mutedIcon);
  }
}
