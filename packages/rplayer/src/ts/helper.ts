import { EVENT } from './constants';
import { Player } from './player';
import { Disposable, PlayerOptions } from './types';
import { addDisposable, isWin10IE } from './utils';
import { SettingControlItem } from './parts/control/items/setting';
import { speedSettingItem } from './setting-items/speed';
import { PlayControlItem } from './parts/control/items/play';
import { VolumeControlItem } from './parts/control/items/volume';
import { TimeControlItem } from './parts/control/items/time';
import { SpacerControlItem } from './parts/control/items/spacer';
import { WebFullscreenControlItem } from './parts/control/items/web-fullscreen';
import { FullscreenControlItem } from './parts/control/items/fullscreen';
import { loopContextMenuItem } from './contextmenu-items/loop';
import { PipContextMenuItem } from './contextmenu-items/pip';
import { versionContextMenuItem } from './contextmenu-items/version';
import { AirplayControlItem } from './parts/control/items/airplay';

function trans(
  player: Player,
  from: string,
  to: string,
): Disposable {
  const fn = (ev: Event) => player.emit(to, ev);
  player.video.addEventListener(from, fn);
  return { dispose: () => player.video.removeEventListener(from, fn) };
}

function transThrottle(
  player: Player,
  from: string,
  to: string,
  dom: HTMLElement | Window = player.video,
): Disposable {
  let pending = false;
  const fn = (ev: Event) => {
    if (pending) return;
    pending = true;
    requestAnimationFrame(() => {
      player.emit(to, ev);
      pending = false;
    });
  };
  dom.addEventListener(from, fn);
  return { dispose: () => dom.removeEventListener('from', fn) };
}

export function tryOpenEdge(player: Player): void {
  if (player.opts.openEdgeInIE && isWin10IE) {
    window.location.href = `microsoft-edge:${document.URL}`;
    player.emit(EVENT.OPEN_EDGE);
  }
}

export function setCssVariables(el: HTMLElement, opts: PlayerOptions): void {
  const style = el.style;
  if (opts.themeColor) style.setProperty('--theme-color', opts.themeColor);
  if (opts.progressColor) style.setProperty('--progress-color', opts.progressColor);
  if (opts.volumeProgressColor) style.setProperty('--volume-progress-color', opts.volumeProgressColor);
}

export function setVideoAttrs(video: HTMLVideoElement, opts: PlayerOptions['videoAttrs']): void {
  if (!opts) return;
  Object.keys(opts).forEach((k) => {
    video.setAttribute(k, opts[k]);
  });
}

export function setVideoVolumeFromLocal(video: HTMLVideoElement): void {
  const volume = parseFloat(localStorage.getItem('rplayer:volume') as string);

  // eslint-disable-next-line no-restricted-globals
  if (!isNaN(volume)) video.volume = volume;
}

export function registerNamedMap(player: Player) {
  player.registerContextMenuItem(loopContextMenuItem);
  player.registerContextMenuItem(PipContextMenuItem);
  player.registerContextMenuItem(versionContextMenuItem);
  player.registerSettingItem(speedSettingItem);
  player.registerControlItem(PlayControlItem);
  player.registerControlItem(VolumeControlItem);
  player.registerControlItem(TimeControlItem);
  player.registerControlItem(SpacerControlItem);
  player.registerControlItem(SettingControlItem);
  player.registerControlItem(WebFullscreenControlItem);
  player.registerControlItem(FullscreenControlItem);
  player.registerControlItem(AirplayControlItem);
}

export function transferEvent(player: Player): void {
  const dis = (d: Disposable) => addDisposable(player, d);

  dis(trans(player, 'durationchange', EVENT.DURATION_CHANGE));
  dis(trans(player, 'ratechange', EVENT.RATE_CHANGE));
  dis(trans(player, 'play', EVENT.PLAY));
  dis(trans(player, 'pause', EVENT.PAUSE));
  dis(trans(player, 'ended', EVENT.ENDED));
  dis(trans(player, 'waiting', EVENT.WAITING));
  dis(trans(player, 'stalled', EVENT.STALLED));
  dis(trans(player, 'canplay', EVENT.CANPLAY));
  dis(trans(player, 'loadedmetadata', EVENT.LOADED_METADATA));
  dis(trans(player, 'error', EVENT.ERROR));
  dis(trans(player, 'seeked', EVENT.SEEKED));
  dis(trans(player, 'enterpictureinpicture', EVENT.ENTER_PIP));
  dis(trans(player, 'leavepictureinpicture', EVENT.EXIT_PIP));

  dis(transThrottle(player, 'timeupdate', EVENT.TIME_UPDATE));
  dis(transThrottle(player, 'volumechange', EVENT.VOLUME_CHANGE));
  dis(transThrottle(player, 'progress', EVENT.PROGRESS));

  dis(transThrottle(player, 'resize', EVENT.UPDATE_SIZE, window));
  if (ResizeObserver) {
    const ro = new ResizeObserver(() => player.emit(EVENT.UPDATE_SIZE));
    ro.observe(player.element);
    dis({ dispose: () => ro.disconnect() });
  }

  player.on(EVENT.LOADED_METADATA, () => {
    if (player.video.paused) {
      player.emit(EVENT.PAUSE);
    } else {
      player.emit(EVENT.PLAY);
    }
  });
}
