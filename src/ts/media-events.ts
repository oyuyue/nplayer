import Events from './events';
import RPlayer from './rplayer';

function handler(player: RPlayer, video: HTMLVideoElement): void {
  video.addEventListener('durationchange', () => {
    player.emit(Events.DURATION_CHANGE, video.duration);
  });

  let timeUpdatePending = false;
  video.addEventListener('timeupdate', () => {
    if (timeUpdatePending) return;
    timeUpdatePending = true;
    requestAnimationFrame(() => {
      player.emit(Events.TIME_UPDATE);
      timeUpdatePending = false;
    });
  });
}

export default handler;
