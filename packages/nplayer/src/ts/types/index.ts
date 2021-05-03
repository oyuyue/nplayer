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

export interface VideoSource {
  media?: string;
  sizes?: string;
  src?: string;
  srcset?: string;
  type?: string;
}

export interface PlayerOptions {
  el?: HTMLElement | string;
  video?: HTMLVideoElement;
  src?: string;
  live?: boolean;
  videoAttrs?: Record<string, any>;
  videoSources?: VideoSource[];
  autoSeekTime?: number;
  thumbnail?: ThumbnailOptions;
  controls?: (ControlItem | string)[];
  topControls?: (ControlItem | string)[];
  settings?: (SettingItem | string)[];
  contextMenus?: (ContextMenuItem | string)[];
  contextMenuToggle?: boolean;
  plugins?: Plugin[];
  shortcut?: boolean;
  seekStep?: number;
  volumeStep?: number;
  themeColor?: string;
  posterBgColor?: string;
  progressBg?: string;
  volumeProgressBg?: string;
  volumeBarWidth?: number | string;
  loadingElement?: HTMLElement;
  openEdgeInIE?: boolean;
  poster?: string;
  posterEnable?: boolean;
  posterPlayElement?: HTMLElement;
  dblclickFullscreen?: boolean;
  clickPause?: boolean;
  [key: string]: any;
}
