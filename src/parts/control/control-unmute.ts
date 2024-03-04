import { addDestroyable, Component, show } from '../../utils';
import type { PlayerBase } from '../../player-base';
import { EVENT } from '../../constants';

export class ControlUnmute extends Component {
  constructor(
    container: HTMLElement,
    private player: PlayerBase,
  ) {
    super(container);
    addDestroyable(this, player.on(EVENT.AUTOPLAY_MUTED, () => {
      if (player.muted) {
        show(this.el);
      }
    }));
  }
}
