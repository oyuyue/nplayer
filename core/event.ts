import type { MediaInfo } from "./config";
import { Player } from "./player";
import { noop } from "./utils";

export enum Events {
  enterFullscreen = 'enterFullscreen',
  exitFullscreen = 'exitFullscreen',
  enterWebFullscreen = 'enterWebFullscreen',
  exitWebFullscreen = 'exitWebFullscreen',
  resize = 'resize',
  mediaInfoChange = 'mediaInfoChange',
  clickPrev = 'clickPrev',
  clickNext = 'clickNext',

  abort = 'abort',
  canplay = 'canplay',
  canplaythrough = 'canplaythrough',
  complete = 'complete',
  durationchange = 'durationchange',
  emptied = 'emptied',
  encrypted = 'encrypted',
  ended = 'ended',
  error = 'error',
  loadeddata = 'loadeddata',
  loadedmetadata = 'loadedmetadata',
  loadstart = 'loadstart',
  pause = 'pause',
  play = 'play',
  playing = 'playing',
  progress = 'progress',
  ratechange = 'ratechange',
  seeked = 'seeked',
  seeking = 'seeking',
  stalled = 'stalled',
  suspend = 'suspend',
  timeupdate = 'timeupdate',
  volumechange = 'volumechange',
  waiting = 'waiting',
  enterPictureInPicture = 'enterPictureInPicture',
  leavePictureInPicture = 'leavePictureInPicture',
}

export class PlayerEvent {
  readonly cancellable: boolean = true;

  readonly defaultPrevented: boolean = false;

  readonly player: Player;

  constructor(player: Player) {
    this.player = player;
  }

  preventDefault() {
    (this as any).defaultPrevented = true;
  }
}

export class UnCancellableEvent extends PlayerEvent {
  readonly cancellable = false;

  constructor(player: Player) {
    super(player);
  }

  preventDefault() {}
}

export class MediaInfoEvent extends UnCancellableEvent {
  info: MediaInfo;

  constructor(player: Player, info: MediaInfo) {
    super(player)
    this.info = info
  }
}

export interface PlayerEvents {
  [Events.enterFullscreen]: UnCancellableEvent;
  [Events.exitFullscreen]: UnCancellableEvent;
  [Events.enterWebFullscreen]: PlayerEvent;
  [Events.exitWebFullscreen]: PlayerEvent;
  [Events.resize]: UnCancellableEvent;
  [Events.mediaInfoChange]: MediaInfoEvent;
  [Events.clickPrev]: UnCancellableEvent;
  [Events.clickNext]: UnCancellableEvent;

  [Events.abort]: UnCancellableEvent;
  [Events.canplay]: UnCancellableEvent;
  [Events.canplaythrough]: UnCancellableEvent;
  [Events.complete]: UnCancellableEvent;
  [Events.durationchange]: UnCancellableEvent;
  [Events.emptied]: UnCancellableEvent;
  [Events.encrypted]: UnCancellableEvent;
  [Events.ended]: UnCancellableEvent;
  [Events.error]: UnCancellableEvent;
  [Events.loadeddata]: UnCancellableEvent;
  [Events.loadedmetadata]: UnCancellableEvent;
  [Events.loadstart]: UnCancellableEvent;
  [Events.pause]: UnCancellableEvent;
  [Events.play]: UnCancellableEvent;
  [Events.playing]: UnCancellableEvent;
  [Events.progress]: UnCancellableEvent;
  [Events.ratechange]: UnCancellableEvent;
  [Events.seeked]: UnCancellableEvent;
  [Events.seeking]: UnCancellableEvent;
  [Events.stalled]: UnCancellableEvent;
  [Events.suspend]: UnCancellableEvent;
  [Events.timeupdate]: UnCancellableEvent;
  [Events.volumechange]: UnCancellableEvent;
  [Events.waiting]: UnCancellableEvent;
  [Events.enterPictureInPicture]: UnCancellableEvent;
  [Events.leavePictureInPicture]: UnCancellableEvent;
}

export function emit(name: keyof PlayerEvents, ev: PlayerEvent) {
  ev.player.emit(name, ev);
  if (ev.defaultPrevented) return false
  return true
}

function trans(
  player: Player,
  from: string,
  to: keyof PlayerEvents,
) {
  player.media.addEventListener(from, () => {
    player.emit(to, new UnCancellableEvent(player))
  });
}

function throttle(fn: Function): any {
  let pending = false;
  let first = true;
  return function () {
    if (first) {
      first = false;
      return fn();
    }

    if (pending) return;
    pending = true;

    requestAnimationFrame(() => {
      fn();
      pending = false;
    });
  };
}

function transThrottle(
  player: Player,
  from: string,
  to: keyof PlayerEvents,
) {
  player.media.addEventListener(from, throttle(() => {
    player.emit(to, new UnCancellableEvent(player))
  }));
}

export function transferEvent(player: Player) {
  trans(player, 'abort', Events.abort)
  trans(player, 'canplay', Events.canplay)
  trans(player, 'canplaythrough', Events.canplaythrough)
  trans(player, 'complete', Events.complete)
  transThrottle(player, 'durationchange', Events.durationchange)
  trans(player, 'emptied', Events.emptied)
  trans(player, 'encrypted', Events.encrypted)
  trans(player, 'ended', Events.ended)
  trans(player, 'error', Events.error)
  trans(player, 'loadeddata', Events.loadeddata)
  trans(player, 'loadedmetadata', Events.loadedmetadata)
  trans(player, 'loadstart', Events.loadstart)
  trans(player, 'pause', Events.pause)
  trans(player, 'play', Events.play)
  trans(player, 'playing', Events.playing)
  transThrottle(player, 'progress', Events.progress)
  trans(player, 'ratechange', Events.ratechange)
  trans(player, 'seeked', Events.seeked)
  transThrottle(player, 'seeking', Events.seeking)
  trans(player, 'stalled', Events.stalled)
  trans(player, 'suspend', Events.suspend)
  transThrottle(player, 'timeupdate', Events.timeupdate)
  transThrottle(player, 'volumechange', Events.volumechange)
  trans(player, 'waiting', Events.waiting)
  trans(player, 'enterpictureinpicture', Events.enterPictureInPicture)
  trans(player, 'leavepictureinpicture', Events.leavePictureInPicture)

  if (window.ResizeObserver) {
    const ro = new ResizeObserver(throttle(() => player.emit(Events.resize, new UnCancellableEvent(player))));
    ro.observe(player.el);
    return () => {
      ro.disconnect()
    }
  }

  return noop;
}
