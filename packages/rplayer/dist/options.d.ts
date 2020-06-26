import { SelectOpts } from './controls/setting/select';
import { SwitchOpts } from './controls/setting/switch';
import { SubtitleOpts } from './plugins/subtitle';
import RPlayer from './rplayer';
import { StorageOpts } from './storage';
import { ContextMenuOpts } from './controls/contextmenu';
import { ShortcutOpts } from './shortcut';
import { ThumbnailOpts } from './controls/thumbnail';
export interface OptionPreset {
    playbackRate?: boolean | {
        position?: number;
        checked?: number;
        steps?: {
            label?: string;
            value?: number;
        }[];
    };
    version?: boolean;
}
export interface Plugin {
    install: (p: RPlayer) => any;
    [key: string]: any;
}
export interface RPlayerOptions {
    media?: string | HTMLVideoElement;
    el?: string | HTMLElement;
    video?: HTMLVideoElement & {
        src?: string | string[];
    };
    settings?: (SelectOpts | SwitchOpts)[];
    preset?: OptionPreset;
    shortcut?: ShortcutOpts;
    lang?: string;
    thumbnail?: ThumbnailOpts;
    contextMenu?: ContextMenuOpts;
    storage?: StorageOpts;
    subtitle?: SubtitleOpts;
    plugins?: Plugin[];
}
export default function processOptions(player: RPlayer, opts?: RPlayerOptions): RPlayerOptions;
//# sourceMappingURL=options.d.ts.map