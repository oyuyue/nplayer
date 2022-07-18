import { Popover } from '../../components/popover';
import { PlayerBase } from '../../player-base';
import { ControlItem } from '../../types';
import {
  $, addDestroyable, Component, Icon,
} from '../../utils';

export class Setting extends Component implements ControlItem {
  id = 'setting'

  private homeEl!: HTMLElement;

  private popover!: Popover;

  constructor() {
    super(undefined, '.setting');
  }

  onInit(player: PlayerBase) {
    this.el.appendChild(Icon.cog());

    this.popover = addDestroyable(this, new Popover(this.el));
    this.homeEl = this.popover.panelEl.appendChild($());
  }

  onShow() {

  }

  onHide() {

  }

  private renderHome(): void {

  }
}
