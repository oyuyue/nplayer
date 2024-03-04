import type { PlayerBase } from '../../player-base';
import type { ControlItem } from '../../types';
import {
  addDestroyableListener, Component, Icon,
} from '../../utils';

export class Forward extends Component implements ControlItem {
  id = 'forward'

  tipText = '1';

  onInit(player: PlayerBase) {
    this.el.appendChild(Icon.airplay());

    addDestroyableListener(this, this.el, 'click', () => player.forward());
  }
}
