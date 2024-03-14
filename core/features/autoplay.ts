import { detectAutoplay } from 'detect-autoplay';
import type { Player } from '../player';
import { Events, UnCancellableEvent } from '../event';

export class Autoplay  {
  constructor(private player: Player) {
  }

  setup = () => {
    const { player } = this;
    if (player.config.autoplay) {
      detectAutoplay()
        .then((canplay) => {
          if (!canplay) {
            if (player.config.autoplayMuted) player.muted = true;
            player.emit(Events.autoplayMuted, new UnCancellableEvent(player));
          }
          player.media.autoplay = true;
          player.once(Events.canplay, () => {
            if (player.config.autoplay) {
              player.play().catch(() => {
                player.emit(Events.autoplayFailed, new UnCancellableEvent(player));
              });
            }
          });
        });
    } else {
      player.media.autoplay = false;
    }
  }
}
