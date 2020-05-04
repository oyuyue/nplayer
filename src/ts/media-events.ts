import Events from './events';
import RPlayer from './rplayer';

function transEvent(
  player: RPlayer,
  video: HTMLVideoElement,
  from: string,
  to: string
): void {
  video.addEventListener(from, () => player.emit(to));
}

function handler(player: RPlayer, video: HTMLVideoElement): void {
  video.addEventListener('durationchange', () => {
    player.emit(Events.DURATION_CHANGE, video.duration);
  });

  transEvent(player, video, 'play', Events.PLAY);
  transEvent(player, video, 'pause', Events.PAUSE);
  transEvent(player, video, 'ended', Events.ENDED);

  let timeUpdatePending = false;
  video.addEventListener('timeupdate', () => {
    if (timeUpdatePending) return;
    timeUpdatePending = true;
    requestAnimationFrame(() => {
      player.emit(Events.TIME_UPDATE);
      timeUpdatePending = false;
    });
  });

  let volumeChangePending = false;
  video.addEventListener('volumechange', () => {
    if (volumeChangePending) return;
    volumeChangePending = true;
    requestAnimationFrame(() => {
      player.emit(Events.VOLUME_CHANGE);
      volumeChangePending = false;
    });
  });
}

export default handler;
