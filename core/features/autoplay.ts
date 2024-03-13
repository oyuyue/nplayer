import { detectAutoplay } from 'detect-autoplay';
import type { Player } from '../player';

export class Autoplay  {
  constructor(private player: Player) {
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
}
