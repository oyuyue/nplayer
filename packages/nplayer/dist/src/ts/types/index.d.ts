import { ContextMenuItem } from '../parts/contextmenu';
import { ControlItem } from '../parts/control';
import { SettingItem } from '../parts/control/items/setting';
import { ThumbnailOptions } from '../parts/control/progress/thumbnail';
import { Player } from '../player';
export interface Disposable {
    dispose: () => void;
}
export interface Plugin extends Partial<Disposable> {
    apply: (player: Player) => void;
}
export interface PlayerOptions {
    el?: HTMLElement | string;
    video?: HTMLVideoElement;
    videoAttrs?: Record<string, any>;
    thumbnail?: ThumbnailOptions;
    controls?: (ControlItem | string)[];
    settings?: (SettingItem | string)[];
    contextMenus?: (ContextMenuItem | string)[];
    contextMenuToggle?: boolean;
    plugins?: Plugin[];
    shortcut?: boolean;
    seekStep?: number;
    volumeStep?: number;
    themeColor?: string;
    progressColor?: string;
    volumeProgressColor?: string;
    volumeBarWidth?: number | string;
    loadingElement?: HTMLElement;
    openEdgeInIE?: boolean;
    poster?: string;
    [key: string]: any;
}
