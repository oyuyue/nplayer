import { EVENT } from './constants';
import { Player } from './player';
import { PlayerOptions } from './types';
import { isWin10IE } from './utils';

function trans(
  player: Player,
  from: string,
  to: string,
): void {
  player.video.addEventListener(from, (ev) => player.emit(to, ev));
}

function transThrottle(
  player: Player,
  from: string,
  to: string,
): void {
  let pending = false;
  player.video.addEventListener(from, (ev) => {
    if (pending) return;
    pending = true;
    requestAnimationFrame(() => {
      player.emit(to, ev);
      pending = false;
    });
  });
}

export function tryOpenEdge(opts: PlayerOptions): void {
  if (opts.openEdgeInIE && isWin10IE) {
    window.location.href = `microsoft-edge:${document.URL}`;
  }
}

export function transferVideoEvent(player: Player): void {
  trans(player, 'durationchange', EVENT.DURATION_CHANGE);
  trans(player, 'ratechange', EVENT.RATE_CHANGE);
  trans(player, 'play', EVENT.PLAY);
  trans(player, 'pause', EVENT.PAUSE);
  trans(player, 'ended', EVENT.ENDED);
  trans(player, 'waiting', EVENT.WAITING);
  trans(player, 'stalled', EVENT.STALLED);
  trans(player, 'canplay', EVENT.CANPLAY);
  trans(player, 'loadedmetadata', EVENT.LOADED_METADATA);
  trans(player, 'error', EVENT.ERROR);
  trans(player, 'seeked', EVENT.SEEKED);
  trans(player, 'enterpictureinpicture', EVENT.ENTER_PIP);
  trans(player, 'leavepictureinpicture', EVENT.EXIT_PIP);

  transThrottle(player, 'timeupdate', EVENT.TIME_UPDATE);
  transThrottle(player, 'volumechange', EVENT.VOLUME_CHANGE);
  transThrottle(player, 'progress', EVENT.PROGRESS);

  player.on(EVENT.LOADED_METADATA, () => {
    if (player.video.paused) {
      player.emit(EVENT.PAUSE);
    } else {
      player.emit(EVENT.PLAY);
    }
  });
}
