import { BP } from './config';
import Events from './events';
import RPlayer from './rplayer';
import { isFn } from './utils';

function trans(
  player: RPlayer,
  dom: HTMLElement | Window,
  from: keyof HTMLVideoElementEventMap,
  to: string
): void {
  dom.addEventListener(from, (ev: MouseEvent) => player.emit(to, ev));
}

function transThrottle(
  player: RPlayer,
  dom: HTMLElement | Window,
  from: keyof HTMLVideoElementEventMap,
  to: string
): void {
  let pending = false;
  dom.addEventListener(from, (ev: MouseEvent) => {
    if (pending) return;
    pending = true;
    requestAnimationFrame(() => {
      player.emit(to, ev);
      pending = false;
    });
  });
}

export default function handler(
  player: RPlayer,
  video: HTMLVideoElement
): void {
  // media
  trans(player, video, 'durationchange', Events.DURATION_CHANGE);
  trans(player, video, 'play', Events.PLAY);
  trans(player, video, 'pause', Events.PAUSE);
  trans(player, video, 'ended', Events.ENDED);
  trans(player, video, 'waiting', Events.WAITING);
  trans(player, video, 'stalled', Events.STALLED);
  trans(player, video, 'canplay', Events.CANPLAY);
  trans(player, video, 'loadedmetadata', Events.LOADED_METADATA);
  trans(player, video, 'error', Events.ERROR);

  transThrottle(player, video, 'timeupdate', Events.TIME_UPDATE);
  transThrottle(player, video, 'volumechange', Events.VOLUME_CHANGE);
  transThrottle(player, video, 'progress', Events.PROGRESS);

  player.on(Events.LOADED_METADATA, () => {
    if (player.media.paused) {
      player.emit(Events.PAUSE);
    } else {
      player.emit(Events.PLAY);
    }
    requestAnimationFrame(player.updateRect);
  });

  // player
  trans(player, player.dom, 'click', Events.PLAYER_CLICK);
  trans(player, player.dom, 'contextmenu', Events.PLAYER_CONTEXT_MENU);
  trans(player, player.dom, 'dblclick', Events.PLAYER_DBLCLICK);

  transThrottle(player, player.dom, 'mousemove', Events.PLAYER_MOUSE_MOVE);
  transThrottle(player, player.dom, 'mouseleave', Events.PLAYER_MOUSE_LEAVE);

  // global
  transThrottle(player, window, 'resize', Events.PLAYER_RESIZE);

  document.addEventListener('click', (ev: MouseEvent) => {
    if (
      ev.target === player.dom ||
      (ev.target &&
        isFn((ev.target as any).contains) &&
        (ev.target as any).contains(player.dom))
    ) {
      player.emit(Events.CLICK_OUTSIDE);
    }
  });

  const mqHandler = ({
    media,
    matches,
  }: MediaQueryListEvent | MediaQueryList): void => {
    if (!matches) return;
    player.curBreakPoint = media;
    player.emit(Events.BREAK_POINT_CHANGE, media);
  };
  Object.keys(BP).forEach((k) => {
    const mq = window.matchMedia(BP[k]);
    mqHandler(mq);
    mq.addListener(mqHandler);
  });
}
