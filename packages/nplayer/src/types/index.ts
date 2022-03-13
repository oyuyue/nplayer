import { Tooltip } from '../components';
import { ContextMenuItem } from '../parts/contextmenu';
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

export interface ControlItem extends Partial<Disposable> {
  el: HTMLElement;
  id?: any;
  tip?: string;
  tooltip?: Tooltip;
  mounted?: boolean;
  disabled?: boolean;
  init?: (player: Player, position: number, tooltip: Tooltip) => void;
  update?: (position: number) => void;
  hide?: () => void;
  isSupport?: (player: Player) => boolean;
  [key: string]: any;
}

export interface PlayerOptions {
  container?: HTMLElement | string;
  video?: HTMLVideoElement;
  src?: string;
  videoProps?: Record<string, any>;
  videoSources?: VideoSource[];
  live?: boolean;
  autoSeekTime?: number;
  thumbnail?: ThumbnailOptions;
  controls?: (ControlItem | string)[][];
  bpControls?: { [key: string]: (ControlItem | string)[][] }
  settings?: (SettingItem | string)[];
  contextMenus?: (ContextMenuItem | string)[];
  contextMenuToggle?: boolean;
  plugins?: Plugin[];
  shortcut?: boolean;
  seekStep?: number;
  i18n?: string;
  volumeStep?: number;
  themeColor?: string;
  posterBgColor?: string;
  progressBg?: string;
  progressDot?: HTMLElement;
  volumeProgressBg?: string;
  volumeBarLength?: number | string;
  volumeVertical?: boolean;
  loadingEl?: HTMLElement;
  openEdgeInIE?: boolean;
  poster?: string;
  posterEnable?: boolean;
  posterPlayEl?: HTMLElement;
  isTouch?: boolean;
  [key: string]: any;
}

interface NewOptions {
  control: {
    items: [];
    bpItems: [];
  },
  contextmenu: {

  }
}
