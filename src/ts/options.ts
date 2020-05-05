import { RadioOption, RadioOpts } from './controls/setting-menu/radio';
import { SwitchOpts } from './controls/setting-menu/switch';
import RPlayer from './rplayer';
import { findIndex, isNum, isObj } from './utils';

export interface OptionPreset {
  playbackRate?:
    | boolean
    | { position?: number; steps?: { label?: string; value?: number }[] };
}

export interface RPlayerOptions {
  media?: string | HTMLVideoElement;
  el?: string | HTMLElement;
  video?: HTMLVideoElement & { src?: string | string[] };
  settings?: (RadioOpts | SwitchOpts)[];
  preset?: OptionPreset;
}

const DEFAULT_PLAY_RATE = {
  steps: [
    { label: '0.5x', value: 0.5 },
    { label: '0.75x', value: 0.75 },
    { label: '正常', value: 1 },
    { label: '1.25x', value: 1.25 },
    { label: '1.5x', value: 1.5 },
    { label: '1.75x', value: 1.75 },
    { label: '2x', value: 2 },
  ],
};

function processPlaybackRate(
  player: RPlayer,
  opts?: RPlayerOptions
): RPlayerOptions {
  if (opts.preset.playbackRate === false) return opts;

  const playbackRate: any =
    isObj(opts.preset.playbackRate) && opts.preset.playbackRate.steps
      ? opts.preset.playbackRate
      : DEFAULT_PLAY_RATE;

  const setting: RadioOpts = {
    label: '速度',
    defaultValue: 2,
    options: playbackRate.steps,
    onChange(opt: RadioOption, next: Function) {
      player.playbackRate(opt.value);
      next();
    },
  };

  findIndex;

  let pos = isNum(playbackRate.position)
    ? playbackRate.position
    : findIndex(opts.settings, (x) => (x as any).options);
  if (pos < 0) pos = 0;

  opts.settings.splice(pos, 0, setting);

  return opts;
}

function processOptions(
  player: RPlayer,
  opts?: RPlayerOptions
): RPlayerOptions {
  opts = opts ? { ...opts } : {};

  opts.settings = opts.settings || [];
  opts.preset = opts.preset || {};

  opts = processPlaybackRate(player, opts);

  return opts;
}

export default processOptions;
