import { RadioOpts } from './controls/setting-menu/radio';
import { SwitchOpts } from './controls/setting-menu/switch';
import { ThumbnailImgBg } from './controls/thumbnail';
import RPlayer from './rplayer';
export interface OptionPreset {
    playbackRate?: boolean | {
        position?: number;
        steps?: {
            label?: string;
            value?: number;
        }[];
    };
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
export interface RPlayerOptions {
    media?: string | HTMLVideoElement;
    el?: string | HTMLElement;
    video?: HTMLVideoElement & {
        src?: string | string[];
    };
    settings?: (RadioOpts | SwitchOpts)[];
    preset?: OptionPreset;
    shortcut?: Shortcut;
    lang?: string;
    thumbnail?: ThumbnailOpts;
}
declare function processOptions(player: RPlayer, opts?: RPlayerOptions): RPlayerOptions;
export default processOptions;
