import type { PlayerBase } from '../../player-base';
import type { ControlItem } from '../../types';
import { EVENT } from '../../constants';
import { addDestroyable, Component, formatTime } from '../../utils';

export class Duration extends Component implements ControlItem {
  id = 'duration'

  onInit(player: PlayerBase) {
    this.el.textContent = formatTime(player.duration);
    addDestroyable(this, player.on(EVENT.DURATIONCHANGE, () => {
      this.el.textContent = formatTime(player.duration);
    }));
  }
}
