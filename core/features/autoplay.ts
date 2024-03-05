import { detectAutoplay } from 'detect-autoplay';
import { EVENT } from '../constants';
import type { Player } from '../player';
import { Destroyable } from '../types';
import { addDestroyable, destroy } from '../utils';

export class Autoplay implements Destroyable {
  constructor(private player: Player) {
    addDestroyable(this, player.on(EVENT.MOUNTED, this.setup));
  }

  setup = () => {
    const { player } = this;
    if (player.config.autoplay) {
      player.load();
      detectAutoplay()
        .then((canplay) => {
          if (!canplay) {
            player.muted = true;
            player.emit(EVENT.AUTOPLAY_MUTED);
          }
          player.media.autoplay = true;
          player.once(EVENT.CANPLAY, () => {
            if (player.config.autoplay) {
              player.play().catch(() => {
                player.emit(EVENT.AUTOPLAY_FAILED);
              });
            }
          });
        });
    } else {
      player.media.autoplay = false;
    }
  }

  destroy() {
    destroy(this);
  }
}
