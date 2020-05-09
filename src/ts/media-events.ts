import Events from './events';
import RPlayer from './rplayer';

function transEvent(
  player: RPlayer,
  video: HTMLVideoElement,
  from: keyof HTMLVideoElementEventMap,
  to: string
): void {
  video.addEventListener(from, () => player.emit(to));
}

function transThrottleEvent(
  player: RPlayer,
  video: HTMLVideoElement,
  from: keyof HTMLVideoElementEventMap,
  to: string
): void {
  let pending = false;
  video.addEventListener(from, () => {
    if (pending) return;
    pending = true;
    requestAnimationFrame(() => {
      player.emit(to);
      pending = false;
    });
  });
}

function handler(player: RPlayer, video: HTMLVideoElement): void {
  transEvent(player, video, 'durationchange', Events.DURATION_CHANGE);
  transEvent(player, video, 'play', Events.PLAY);
  transEvent(player, video, 'pause', Events.PAUSE);
  transEvent(player, video, 'ended', Events.ENDED);
  transEvent(player, video, 'waiting', Events.WAITING);
  transEvent(player, video, 'stalled', Events.STALLED);
  transEvent(player, video, 'canplay', Events.CANPLAY);

  transThrottleEvent(player, video, 'timeupdate', Events.TIME_UPDATE);
  transThrottleEvent(player, video, 'volumechange', Events.VOLUME_CHANGE);
  transThrottleEvent(player, video, 'progress', Events.PROGRESS);
}

export default handler;
