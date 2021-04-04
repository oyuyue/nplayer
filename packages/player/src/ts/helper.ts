import { EVENT } from './constants';
import { Player } from './player';
import { PlayerOptions } from './types';
import { isWin10IE } from './utils';
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
): void {
  player.video.addEventListener(from, (ev) => player.emit(to, ev));
}

function transThrottle(
  player: Player,
  from: string,
  to: string,
  dom: HTMLElement | Window = player.video,
): void {
  let pending = false;
  dom.addEventListener(from, (ev) => {
    if (pending) return;
    pending = true;
    requestAnimationFrame(() => {
      player.emit(to, ev);
      pending = false;
    });
  });
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

  transThrottle(player, 'resize', EVENT.UPDATE_SIZE, window);

  player.on(EVENT.LOADED_METADATA, () => {
    if (player.video.paused) {
      player.emit(EVENT.PAUSE);
    } else {
      player.emit(EVENT.PLAY);
    }
  });
}
