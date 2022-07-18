import { Tooltip } from './components';
import { EVENT } from './constants';
import { PlayerBase } from './player-base';

export type Source = string | ({ src?: string; srcset?: string; type?: string;})[]

export type IconSource = string | HTMLElement | SVGElement;

export interface MediaItem {
  src?: Source;
  title?: string;
  poster?: string;
  duration?: number;
}

export interface ProgressConfig {
  duration?: number;
  heatMap?: {
    points: (number | { duration?: number; score: number })[];
    defaultDuration?: number;
  };
  chapters?: { time?: number, title: string }[];
  markers?: {
    time: number,
    title?: string,
    image?: string,
    el?: HTMLElement,
    size?: number[],
    [key: string]: any
  }[];
  thumbnail?: {
    start?: number;
    gap?: number;
    row?: number;
    col?: number;
    width?: number;
    height?: number;
    images?: string[];
  }
}

export interface SettingItem<T = any> {
  id?: string;
  type?: 'switch' | 'select';
  icon?: IconSource;
  label?: string | HTMLElement;
  checked?: boolean;
  value?: T;
  options?: {
    value: T;
    label?: string | HTMLElement;
    selectedLabel?: string | HTMLElement;
  }[];
  onInit?: (player: PlayerBase) => void;
  onChange?: (value: T, player: PlayerBase) => void;
  [key: string]: any;
}

export interface PlayerConfig<M extends HTMLMediaElement> {
  container?: HTMLElement | string;
  media?: M;
  mediaAttrs?: Record<string, string>;

  src?: Source;
  poster?: string;
  title?: string;
  prev?: MediaItem;
  next?: MediaItem;
  live?: boolean;

  control?: {
    disabled?: boolean;
    items?: (ControlItem | string)[][];
    bpItems?: Record<string | number, (ControlItem | string)[][]>;
    settings?: SettingItem[];
    drawerItems?: SettingItem[];
    speeds?: ListItem[];
    qualities?: ListItem[];
    qualitiesDefault?: number;
    volumeLength?: number | string;
    volumeHorizontal?: boolean;
    progress?: ProgressConfig;
  };

  contextmenu?: {
    disabled?: boolean;
    toggleNative?: boolean;
    items?: ContextmenuItem[];
  };

  loading?: {
    disabled?: boolean;
    el?: HTMLElement;
  };

  plugins?: [];

  [key: string]: any;
}

export interface ListItem {
  label: string | HTMLElement;
  selected?: string | HTMLElement;
  value?: any;
  el?: HTMLElement;
  [key: string]: any;
}

export interface ControlItem extends Partial<Destroyable> {
  id: string;
  el?: HTMLElement;
  tipText?: string;
  tooltip?: Tooltip;
  create?: (player: PlayerBase) => ControlItem;
  onInit?: (player: PlayerBase, posX: number, posY: number, tooltip?: Tooltip) => void;
  onShow?: (posX: number, posY: number) => void;
  onHide?: (posX: number) => void;
  isSupported?: (player: PlayerBase) => boolean;

  created__?: boolean;
  pos__?: number;

  [key: string]: any;
}

export interface ContextmenuItem {
  id?: string;
  icon?: string | HTMLElement;
  el?: string | HTMLElement;
  disabled?: boolean;
  onClick?: (item: ContextmenuItem, player: PlayerBase) => void;
  [key: string]: any
}

export interface PlayerEventTypes {
  [EVENT.MOUNTED]: (p: PlayerBase) => void;
  [EVENT.REMOUNTED]: (p: PlayerBase) => void;
  [EVENT.RESIZE]: () => void;
  [EVENT.CONTROL_SHOW]: (p: PlayerBase) => void;
  [EVENT.CONTROL_HIDE]: (p: PlayerBase) => void;
  [EVENT.LOADING_SHOW]: (p: PlayerBase) => void;
  [EVENT.LOADING_HIDE]: (p: PlayerBase) => void;
  [EVENT.QUALITY_CHANGE]: (e: { item: ListItem, select: () => void }) => void;
  [EVENT.PREV]: () => void;
  [EVENT.NEXT]: () => void;
  [EVENT.PREV_CLICK]: () => void;
  [EVENT.NEXT_CLICK]: () => void;

  [EVENT.ABORT]: (p: PlayerBase) => void;
  [EVENT.CANPLAY]: (p: PlayerBase) => void;
  [EVENT.CANPLAYTHROUGH]: (p: PlayerBase) => void;
  [EVENT.DURATIONCHANGE]: (p: PlayerBase) => void;
  [EVENT.EMPTIED]: (p: PlayerBase) => void;
  [EVENT.ENDED]: (p: PlayerBase) => void;
  [EVENT.LOADSTART]: (p: PlayerBase) => void;
  [EVENT.LOADEDDATA]: (p: PlayerBase) => void;
  [EVENT.LOADEDMETADATA]: (p: PlayerBase) => void;
  [EVENT.PAUSE]: (p: PlayerBase) => void;
  [EVENT.PLAY]: (p: PlayerBase) => void;
  [EVENT.PLAYING]: (p: PlayerBase) => void;
  [EVENT.PROGRESS]: (p: PlayerBase) => void;
  [EVENT.RATECHANGE]: (p: PlayerBase) => void;
  [EVENT.SEEKED]: (p: PlayerBase) => void;
  [EVENT.SEEKING]: (p: PlayerBase) => void;
  [EVENT.STALLED]: (p: PlayerBase) => void;
  [EVENT.SUSPEND]: (p: PlayerBase) => void;
  [EVENT.TIMEUPDATE]: (p: PlayerBase) => void;
  [EVENT.VOLUMECHANGE]: (p: PlayerBase) => void;
  [EVENT.WAITING]: (p: PlayerBase) => void;

  [key: string]: any;
}

export interface Destroyable {
  destroy: () => void;
}
