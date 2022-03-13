import { Tooltip } from './components';
import { EVENT } from './constants';
import { PlayerBase } from './player-base';

export interface PlayerConfig<M extends HTMLMediaElement> {
  container?: HTMLElement | string;
  media?: M;
  src?: string | ({ media: string; sizes: string; src: string; srcset: string; type: string;})[];
  mediaAttrs?: Record<string, string>;
  live?: boolean;
  control?: {
    disabled?: boolean;
    items?: (ControlItem | string)[][];
    bpItems?: Record<string | number, (ControlItem | string)[][]>;
    speeds?: ListItem[];
    qualities?: ListItem[];
    qualitiesDefault?: number;
    volumeLength?: number | string;
    volumeHorizontal?: boolean;
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
  addMediaToDom?: boolean;

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
  el?: HTMLElement;
  id: string;
  tip?: string;
  tooltip?: Tooltip;
  _created?: boolean;
  disabled?: boolean;
  create?: (player: PlayerBase) => ControlItem;
  onInit?: (player: PlayerBase, position: number, tooltip?: Tooltip) => void;
  onUpdate?: (position: number) => void;
  onShow?: () => void;
  onHide?: () => void;
  isSupported?: (player: PlayerBase) => boolean;
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
