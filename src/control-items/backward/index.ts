import type { PlayerBase } from '../../player-base';
import type { ControlItem } from '../../types';
import {
  addDestroyableListener, Component, Icon,
} from '../../utils';

export class Backward extends Component implements ControlItem {
  id = 'backward'

  tipText = '1';

  onInit(player: PlayerBase) {
    this.el.appendChild(Icon.airplay());

    addDestroyableListener(this, this.el, 'click', () => player.backward());
  }
}
