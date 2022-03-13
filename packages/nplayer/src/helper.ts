import { EVENT } from './constants';
import { Player } from './player';
import { Disposable, PlayerOptions } from './types';
import { addDisposable, isWin10IE, throttle } from './utils';
import { settingControlItem } from './parts/control/items/setting';
import { speedSettingItem } from './setting-items/speed';
import { playControlItem } from './parts/control/items/play';
import { volumeControlItem } from './parts/control/items/volume';
import { timeControlItem } from './parts/control/items/time';
import { webFullscreenControlItem } from './parts/control/items/web-fullscreen';
import { fullscreenControlItem } from './parts/control/items/fullscreen';
import { loopContextMenuItem } from './contextmenu-items/loop';
import { pipContextMenuItem } from './contextmenu-items/pip';
import { versionContextMenuItem } from './contextmenu-items/version';
import { airplayControlItem } from './parts/control/items/airplay';
import { progressControlItem } from './parts/control/progress';

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
  fn = (ev: Event) => { player.emit(to, ev); },
): Disposable {
  dom.addEventListener(from, throttle(fn));
  return { dispose: () => dom.removeEventListener(from, fn) };
}

export function tryOpenEdge(player: Player): void {
  if (player.opts.openEdgeInIE && isWin10IE) {
    window.location.assign(`microsoft-edge:${document.URL}`);
    player.emit(EVENT.OPEN_EDGE);
  }
}

export function setCssVariables(el: HTMLElement, opts: PlayerOptions): void {
  const style = el.style;
  if (opts.themeColor) style.setProperty('--theme-color', opts.themeColor);
  if (opts.progressBg) style.setProperty('--progress-bg', opts.progressBg);
  if (opts.posterBgColor) style.setProperty('--poster-bg-color', opts.posterBgColor);
  if (opts.volumeProgressBg) style.setProperty('--volume-progress-bg', opts.volumeProgressBg);
}

export function setVideoAttrs(video: HTMLVideoElement, opts: PlayerOptions['videoAttrs']): void {
  if (!opts) return;
  Object.keys(opts).forEach((k) => {
    video.setAttribute(k, opts[k]);
  });
}

export function setVideoSources(video: HTMLVideoElement, opts: PlayerOptions['videoSources']): void {
  if (!opts) return;
  video.innerHTML = '';
  if (!opts.length) return;
  const frag = document.createDocumentFragment();
  opts.forEach((s) => {
    const source = document.createElement('source');
    Object.keys(s).forEach((k) => {
      source.setAttribute(k, (s as any)[k]);
    });
    frag.appendChild(source);
  });
  video.appendChild(frag);
}

const storageVolumeKey = 'nplayer:volume';
export function setVideoVolumeFromLocal(video: HTMLVideoElement): void {
  try {
    const volume = parseFloat(localStorage.getItem(storageVolumeKey) as string);

    // eslint-disable-next-line no-restricted-globals
    if (!isNaN(volume)) video.volume = volume;
  } catch (error) {
    // ignore
  }
}

export function saveVideoVolume(volume: number) {
  try {
    localStorage.setItem(storageVolumeKey, String(volume));
  } catch (error) {
    // ignore
  }
}

export function registerNamedMap(player: Player) {
  player.registerContextMenuItem(loopContextMenuItem());
  player.registerContextMenuItem(pipContextMenuItem());
  player.registerContextMenuItem(versionContextMenuItem());
  player.registerSettingItem(speedSettingItem());
  player.registerControlItem(playControlItem());
  player.registerControlItem(volumeControlItem());
  player.registerControlItem(timeControlItem());
  player.registerControlItem(settingControlItem());
  player.registerControlItem(webFullscreenControlItem());
  player.registerControlItem(fullscreenControlItem());
  player.registerControlItem(airplayControlItem());
  player.registerControlItem(progressControlItem());
}

export function tryEmitUpdateSize(player: Player, ev?: Event): void {
  if (player && player.rect.changed) {
    player.emit(EVENT.UPDATE_SIZE, ev);
  }
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

  dis(transThrottle(player, 'resize', EVENT.UPDATE_SIZE, window, (ev) => tryEmitUpdateSize(player, ev)));
  if ((window as any).ResizeObserver) {
    const ro = new ResizeObserver(throttle(() => player.emit(EVENT.UPDATE_SIZE)));
    ro.observe(player.el);
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
