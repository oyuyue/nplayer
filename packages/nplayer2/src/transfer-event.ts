import type { PlayerBase } from './player-base';
import { EVENT } from './constants';
import { addDestroyable, throttle } from './utils';

function trans(
  player: PlayerBase,
  from: string,
  to: string,
) {
  const fn = () => player.emit(to, player);
  player.media.addEventListener(from, fn);
  addDestroyable(player, { destroy: () => player.media.removeEventListener(from, fn) });
}

function transThrottle(
  player: PlayerBase,
  from: string,
  to: string,
  dom: HTMLElement | Window = player.media,
  fn = (ev: Event) => { player.emit(to, ev); },
) {
  dom.addEventListener(from, throttle(fn));
  return addDestroyable(player, { destroy: () => dom.removeEventListener(from, fn) });
}

export function transferEvent(player: PlayerBase) {
  trans(player, 'abort', EVENT.ABORT);
  trans(player, 'canplay', EVENT.CANPLAY);
  trans(player, 'canplaythrough', EVENT.CANPLAYTHROUGH);
  transThrottle(player, 'durationchange', EVENT.DURATIONCHANGE);
  trans(player, 'emptied', EVENT.EMPTIED);
  trans(player, 'ended', EVENT.ENDED);
  trans(player, 'loadstart', EVENT.LOADSTART);
  trans(player, 'loadeddata', EVENT.LOADEDDATA);
  trans(player, 'loadedmetadata', EVENT.LOADEDMETADATA);
  trans(player, 'pause', EVENT.PAUSE);
  trans(player, 'play', EVENT.PLAY);
  trans(player, 'playing', EVENT.PLAYING);
  transThrottle(player, 'progress', EVENT.PROGRESS);
  trans(player, 'ratechange', EVENT.RATECHANGE);
  trans(player, 'seeked', EVENT.SEEKED);
  transThrottle(player, 'seeking', EVENT.SEEKING);
  trans(player, 'stalled', EVENT.STALLED);
  trans(player, 'suspend', EVENT.SUSPEND);
  transThrottle(player, 'timeupdate', EVENT.TIMEUPDATE);
  transThrottle(player, 'volumechange', EVENT.VOLUMECHANGE);
  trans(player, 'waiting', EVENT.WAITING);
  trans(player, 'enterpictureinpicture', EVENT.ENTER_PIP);
  trans(player, 'leavepictureinpicture', EVENT.EXIT_PIP);

  if ((window as any).ResizeObserver) {
    const ro = new ResizeObserver(throttle(() => player.emit(EVENT.RESIZE)));
    ro.observe(player.el);
    addDestroyable(player, { destroy: () => ro.disconnect() });
  } else {
    transThrottle(player, 'resize', EVENT.RESIZE, window, () => {
      if (player && player.rect.changed) {
        player.emit(EVENT.RESIZE);
      }
    });
  }
}
