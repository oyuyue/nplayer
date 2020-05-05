import { RadioOpts } from './controls/setting-menu/radio';
import { SwitchOpts } from './controls/setting-menu/switch';
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
export interface RPlayerOptions {
    media?: string | HTMLVideoElement;
    el?: string | HTMLElement;
    video?: HTMLVideoElement & {
        src?: string | string[];
    };
    settings?: (RadioOpts | SwitchOpts)[];
    preset?: OptionPreset;
}
declare function processOptions(player: RPlayer, opts?: RPlayerOptions): RPlayerOptions;
export default processOptions;
