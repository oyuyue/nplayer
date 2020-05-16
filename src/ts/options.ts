import { NORMAL, SPEED } from './config/lang';
import { RadioOption, RadioOpts } from './controls/setting-menu/radio';
import { SwitchOpts } from './controls/setting-menu/switch';
import { ThumbnailImgBg } from './controls/thumbnail';
import { t } from './i18n';
import RPlayer from './rplayer';
import Storage from './storage';
import { findIndex, isNum, isObj } from './utils';

export interface OptionPreset {
  playbackRate?:
    | boolean
    | {
        position?: number;
        defaultIndex?: number;
        steps?: { label?: string; value?: number }[];
      };
  version?: boolean;
}

export interface StorageOpts {
  enable?: boolean;
  key?: string;
}

export interface Shortcut {
  enable?: boolean;
  time?: number;
  volume?: number;
  global?: boolean;
}

export interface ThumbnailOpts {
  startTime?: number;
  gapSec?: number;
  col?: number;
  row?: number;
  width?: number;
  height?: number;
  images?: string[];
  handler?: (seconds: number) => ThumbnailImgBg;
}

export interface ContextMenuItem {
  icon?: string | Element;
  label?: string | Element;
  checked?: boolean;
  onClick?: (checked: boolean, update: () => void, ev: MouseEvent) => any;
}

export interface ContextMenuOpts {
  toggle?: boolean;
  enable?: boolean;
  items?: ContextMenuItem[];
}

export interface RPlayerOptions {
  media?: string | HTMLVideoElement;
  el?: string | HTMLElement;
  video?: HTMLVideoElement & { src?: string | string[] };
  settings?: (RadioOpts | SwitchOpts)[];
  preset?: OptionPreset;
  shortcut?: Shortcut;
  lang?: string;
  thumbnail?: ThumbnailOpts;
  contextMenu?: ContextMenuOpts;
  storage?: StorageOpts;
}

function processPlaybackRate(
  opts: RPlayerOptions,
  player: RPlayer
): RPlayerOptions {
  if (opts.preset.playbackRate === false) return opts;

  const DEFAULT_PLAY_RATE = {
    steps: [
      { label: '0.5x', value: 0.5, i: 0 },
      { label: '0.75x', value: 0.75, i: 1 },
      { label: t(NORMAL, opts.lang), value: 1, i: 2 },
      { label: '1.25x', value: 1.25, i: 3 },
      { label: '1.5x', value: 1.5, i: 4 },
      { label: '1.75x', value: 1.75, i: 5 },
      { label: '2x', value: 2, i: 6 },
    ],
    defaultIndex: 2,
  };

  const playbackRate: any =
    isObj(opts.preset.playbackRate) && opts.preset.playbackRate.steps
      ? opts.preset.playbackRate
      : DEFAULT_PLAY_RATE;

  const defaultIndex = player.storage.get(
    'playbackRate',
    playbackRate.defaultIndex
  );

  const setting: RadioOpts = {
    label: t(SPEED, opts.lang),
    defaultValue: defaultIndex,
    options: playbackRate.steps,
    onChange(opt: RadioOption, next: Function) {
      player.playbackRate = opt.value;
      player.storage.set({ playbackRate: opt.i });
      next();
    },
  };

  let pos = isNum(playbackRate.position)
    ? playbackRate.position
    : findIndex(opts.settings, (x) => (x as any).options);
  if (pos < 0) pos = 0;

  opts.settings.splice(pos, 0, setting);

  return opts;
}

function processShortcut(opts: RPlayerOptions): RPlayerOptions {
  const DEFAULT_SHORTCUT = {
    enable: true,
    time: 10,
    volume: 0.1,
    global: false,
  };
  opts.shortcut = { ...opts.shortcut, ...DEFAULT_SHORTCUT };
  return opts;
}

function processLang(opts: RPlayerOptions): RPlayerOptions {
  opts.lang =
    opts.lang || navigator.language || (navigator as any).userLanguage;
  return opts;
}

function processThumbnail(opts: RPlayerOptions): RPlayerOptions {
  opts.thumbnail = {
    ...{
      startTime: 0,
      gapSec: 10,
      col: 5,
      row: 5,
      width: 160,
      height: 90,
      images: [],
    },
    ...opts.thumbnail,
  };

  return opts;
}

function processContextMenu(opts: RPlayerOptions): RPlayerOptions {
  opts.contextMenu = opts.contextMenu || {};
  opts.contextMenu.items = opts.contextMenu.items || [];

  if (opts.preset.version !== false) {
    opts.contextMenu.items.push({
      label: 'RPlayer: v' + __VERSION,
    });
  }

  opts.contextMenu = {
    ...{
      enable: true,
      toggle: true,
    },
    ...opts.contextMenu,
  };

  return opts;
}

function processStorage(opts: RPlayerOptions): RPlayerOptions {
  opts.storage = {
    ...{
      enable: true,
      key: 'rplayer',
    },
    ...opts.storage,
  };

  return opts;
}

function processOptions(
  player: RPlayer,
  opts?: RPlayerOptions
): RPlayerOptions {
  opts = opts ? { ...opts } : {};

  opts.settings = opts.settings || [];
  opts.preset = opts.preset || {};

  opts = processStorage(opts);
  player.storage = new Storage(opts);

  opts = processLang(opts);
  opts = processPlaybackRate(opts, player);
  opts = processShortcut(opts);
  opts = processThumbnail(opts);
  opts = processContextMenu(opts);

  return opts;
}

export default processOptions;
