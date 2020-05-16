import { RadioOpts } from './controls/setting-menu/radio';
import { SwitchOpts } from './controls/setting-menu/switch';
import { ThumbnailImgBg } from './controls/thumbnail';
import RPlayer from './rplayer';
export interface OptionPreset {
    playbackRate?: boolean | {
        position?: number;
        defaultIndex?: number;
        steps?: {
            label?: string;
            value?: number;
        }[];
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
    video?: HTMLVideoElement & {
        src?: string | string[];
    };
    settings?: (RadioOpts | SwitchOpts)[];
    preset?: OptionPreset;
    shortcut?: Shortcut;
    lang?: string;
    thumbnail?: ThumbnailOpts;
    contextMenu?: ContextMenuOpts;
    storage?: StorageOpts;
}
declare function processOptions(player: RPlayer, opts?: RPlayerOptions): RPlayerOptions;
export default processOptions;
