import type { PlayerBase } from '../player-base';
import { EVENT } from '../constants';
import { Destroyable } from '../types';
import { addDestroyable, destroy } from '../utils';

export class PlayerMediaSession implements Destroyable {
  private constructor(player: PlayerBase) {
    const { mediaSession } = navigator;
    addDestroyable(this, player.on(EVENT.PLAY, () => mediaSession.playbackState = 'playing'));
    addDestroyable(this, player.on(EVENT.PAUSE, () => mediaSession.playbackState = 'paused'));
    addDestroyable(this, player.on(EVENT.MEDIA_CHANGED, (info) => {
      mediaSession.metadata = new MediaMetadata({
        title: info.title,
        artist: info.artist,
        artwork: info.poster ? [{ src: info.poster }] : undefined,
      });
      mediaSession.setActionHandler('previoustrack', info.prev ? () => {
        player.emit(EVENT.PREV_CLICK);
      } : null);
      mediaSession.setActionHandler('nexttrack', info.next ? () => {
        player.emit(EVENT.NEXT_CLICK);
      } : null);
    }));

    mediaSession.setActionHandler('play', () => player.play());
    mediaSession.setActionHandler('pause', () => player.pause());
    mediaSession.setActionHandler('stop', () => player.stop());
    mediaSession.setActionHandler('seekbackward', () => player.backward());
    mediaSession.setActionHandler('seekforward', () => player.forward());
  }

  destroy() {
    const { mediaSession } = navigator;
    mediaSession.setActionHandler('play', null);
    mediaSession.setActionHandler('pause', null);
    mediaSession.setActionHandler('stop', null);
    mediaSession.setActionHandler('seekbackward', null);
    mediaSession.setActionHandler('seekforward', null);
    mediaSession.setActionHandler('previoustrack', null);
    mediaSession.setActionHandler('nexttrack', null);
    mediaSession.setActionHandler('seekto', null);
    mediaSession.setActionHandler('skipad', null);
    destroy(this);
  }

  static create(player: PlayerBase) {
    if ('mediaSession' in navigator) {
      return new PlayerMediaSession(player);
    }
  }
}
