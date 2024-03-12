import type { Player } from '../player'

export class PlayerMediaSession  {
  private constructor(player: Player) {
    const { mediaSession } = navigator;
    mediaSession.setActionHandler('play', () => player.play());
    mediaSession.setActionHandler('pause', () => player.pause());
    mediaSession.setActionHandler('stop', () => player.stop());
    mediaSession.setActionHandler('seekbackward', () => player.seekBackward());
    mediaSession.setActionHandler('seekforward', () => player.seekForward());
    mediaSession.setActionHandler('seekto', (info) => {
      if (info.seekTime == null) return;
      player.seek(info.seekTime)
    });
    if (player.config.onSkipad) {
      mediaSession.setActionHandler('skipad', player.config.onSkipad);
    }

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
  }

  destroy() {
    const { mediaSession } = navigator;
    mediaSession.metadata = null;
    mediaSession.setActionHandler('play', null);
    mediaSession.setActionHandler('pause', null);
    mediaSession.setActionHandler('stop', null);
    mediaSession.setActionHandler('seekbackward', null);
    mediaSession.setActionHandler('seekforward', null);
    mediaSession.setActionHandler('previoustrack', null);
    mediaSession.setActionHandler('nexttrack', null);
    mediaSession.setActionHandler('seekto', null);
    mediaSession.setActionHandler('skipad', null);
  }

  static create(player: Player) {
    if ('mediaSession' in navigator) {
      return new PlayerMediaSession(player);
    }
  }
}
