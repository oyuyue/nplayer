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
  videoOptions?: Record<string, any>;
  thumbnail?: ThumbnailOptions;
  controls?: (ControlItem | string)[];
  settings?: (SettingItem | string)[];
  contextMenus?: (ContextMenuItem | string)[];
  plugins?: Plugin[];
  shortcut?: boolean;
  seekStep?: number;
  volumeStep?: number;
  themeColor?: string;
  progressBarColor?: string;
  volumeProgressBarColor?: string;
}
