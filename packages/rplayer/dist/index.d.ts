declare module "config/index" {
    export const BP: Record<string, string>;
}
declare module "config/classname" {
    export const PLAYER = "rplayer";
    export const PREFIX: string;
    export const ACTIVE = "-active";
    export const PAUSED: string;
    export const LOADING: string;
    export const PLAYER_LOADING: string;
    export const FULL: string;
    export const CTRL: string;
    export const CTRL_MASK: string;
    export const CTRL_HIDE: string;
    export const CTRL_BOTTOM: string;
    export const CTRL_BOTTOM_MASK: string;
    export const CTRL_TRAYS: string;
    export const CTRL_MENU: string;
    export const CTRL_MENU_ITEM: string;
    export const CTRL_MENU_ITEM_I: string;
    export const CTRL_MENU_ITEM_CHECKED: string;
    export const THUMB: string;
    export const THUMB_TIME: string;
    export const THUMB_IMG: string;
    export const PROGRESS: string;
    export const PROGRESS_WRAPPER: string;
    export const PROGRESS_BUF: string;
    export const PROGRESS_HOVER: string;
    export const PROGRESS_PLAYED: string;
    export const PROGRESS_PAD: string;
    export const PROGRESS_DOT: string;
    export const TOOLTIP: string;
    export const TOOLTIP_TEXT: string;
    export const TOOLTIP_TEXT_LEFT: string;
    export const TOOLTIP_TEXT_RIGHT: string;
    export const TRAY: string;
    export const TRAY_TIME: string;
    export const TRAY_VOLUME: string;
    export const TRAY_VOLUME_PROGRESS: string;
    export const TRAY_VOLUME_BAR: string;
    export const TRAY_VOLUME_DOT: string;
    export const TRAY_VOLUME_I_MUTED: string;
    export const TRAY_VOLUME_BAR_WRAPPER: string;
    export const TRAY_SETTING: string;
    export const TRAY_SETTING_ACTIVE: string;
    export const SETTINGS: string;
    export const SETTINGS_SELECT_OPT: string;
    export const SETTINGS_SELECT_OPT_ACTIVE: string;
    export const SETTINGS_MENU: string;
    export const SETTINGS_MENU_ITEM: string;
    export const SETTINGS_MENU_PAGE: string;
    export const SETTINGS_MENU_BACK: string;
    export const SETTINGS_MENU_SELECT: string;
    export const SWITCH: string;
    export const SWITCH_ACTIVE: string;
    export const CAPTION: string;
    export const CAPTION_ACTIVE: string;
    export const CAPTION_TRAY: string;
    export const CAPTION_TRAY_ACTIVE: string;
    export const ICON: string;
    export const ICON_ENTER_FS: string;
    export const ICON_EXIT_FS: string;
    export const ICON_PLAY: string;
    export const ICON_PAUSE: string;
    export const ICON_VOLUME: string;
    export const ICON_MUTED: string;
    export const BAR: string;
    export const DOT: string;
}
declare module "events" {
    enum Events {
        BEFORE_MOUNT = "BeforeMount",
        MOUNTED = "Mounted",
        CONTROLS_SHOW = "ControlsShow",
        CONTROLS_HIDE = "ControlsHide",
        ENTER_FULLSCREEN = "EnterFullscreen",
        EXIT_FULLSCREEN = "ExitFullscreen",
        DURATION_CHANGE = "DurationChange",
        TIME_UPDATE = "TimeUpdate",
        VOLUME_CHANGE = "VolumeChange",
        LOADED_METADATA = "LoadedMetadata",
        PLAY = "Play",
        PAUSE = "Pause",
        ENDED = "Ended",
        PROGRESS = "Progress",
        CANPLAY = "Canplay",
        WAITING = "Waiting",
        PLAYING = "Playing",
        STALLED = "Stalled",
        ERROR = "Error",
        BREAK_POINT_CHANGE = "BreakPointChange",
        CLICK_CONTROL_MASK = "ClickControlMask",
        CLICK_OUTSIDE = "ClickOutside",
        PLAYER_CLICK = "PlayerClick",
        PLAYER_CONTEXT_MENU = "PlayerContextMenu",
        PLAYER_DBLCLICK = "PlayerDblclick",
        PLAYER_MOUSE_MOVE = "PlayerMouseMove",
        PLAYER_MOUSE_LEAVE = "PlayerMouseLeave",
        PLAYER_RESIZE = "PlayerResize",
        SETTING_SELECTED = "SettingSelected"
    }
    export default Events;
}
declare module "utils/drag" {
    type Fn = (ev: PointerEvent) => any;
    export default class Drag {
        private readonly dom;
        private readonly start;
        private readonly move;
        private readonly end;
        private pending;
        private lastEv;
        constructor(dom: HTMLElement, start: Fn, move: Fn, end?: Fn);
        private downHandler;
        private moveHandler;
        private handlerMove;
        private upHandler;
        destroy(): void;
    }
}
declare module "utils/index" {
    export { default as Drag } from "utils/drag";
    export function noop(): void;
    export function clamp(n: number, lower?: number, upper?: number): number;
    export function isStr(o: any): o is string;
    export function isNum(o: any): o is number;
    export function isFn(o: any): o is Function;
    export function isObj(o: any): o is Record<string, any>;
    export function isElement(o: any): o is Element;
    export function isCatchable(o: any): o is {
        catch: Function;
    };
    export function clampNeg(n: number, max: number, defaults?: number): number;
    export function findIndex<T>(arr: T[], predicate: (value: T, index: number, obj: T[]) => unknown): number;
    export function getDomOr<T extends HTMLElement>(dom: HTMLElement | string, orReturn?: (() => T) | T): T;
    export function htmlDom(html?: string, tag?: string, className?: string): HTMLElement;
    export function measureElementSize(dom: HTMLElement): {
        width: number;
        height: number;
    };
    export function newElement<T extends HTMLElement>(className?: string, tag?: keyof HTMLElementTagNameMap): T;
    export function strToDom(str: string, type?: SupportedType): HTMLElement;
    export function svgToDom(str: string, className?: string): HTMLElement;
    export function padStart(v: string | number, len?: number, str?: string): string;
    export function formatTime(seconds: number): string;
    export const ua: {
        isEdge: boolean;
        isIos: boolean;
        isIE: boolean;
    };
    export const makeDictionary: <T>(obj: T) => T;
    export const getClientWH: () => [number, number];
    export const safeJsonParse: <T extends Record<string, any>>(str: string, orRet?: T) => string | T;
    export const safeJsonStringify: (obj: Record<string, any>, orRet?: string) => string;
    export const extend: (target: Record<string, any>, source: Record<string, any>) => Record<string, any>;
    export const ajax: (url: string, cb: (err: any, data?: string) => any) => void;
}
declare module "controls/contextmenu" {
    import Component from "component";
    import RPlayer from "rplayer";
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
    export class MenuItem {
        readonly dom: HTMLElement;
        private checked;
        private readonly cb;
        constructor(item: ContextMenuItem);
        private next;
        update(): void;
        clickHandler: (ev: MouseEvent) => void;
    }
    export default class ContextMenu extends Component {
        private showed;
        private enable;
        private toggle;
        constructor(player: RPlayer);
        hide(): void;
        show(): void;
        clickHandler: (ev: MouseEvent) => void;
        addItem(opts: ContextMenuItem, pos?: number): MenuItem;
        onPlayerContextMenu(ev: MouseEvent): void;
        onClickOutside(): void;
        onClickControlMask(): void;
    }
}
declare module "controls/mask" {
    import RPlayer from "rplayer";
    export default class Mask {
        private readonly player;
        readonly dom: HTMLElement;
        constructor(player: RPlayer);
        get isActive(): boolean;
        private clickHandler;
        show(): void;
        hide(): void;
    }
}
declare module "controls/bar" {
    export default class Bar {
        readonly dom: HTMLElement;
        constructor(className?: string);
        setX(x: number): void;
    }
}
declare module "controls/dot" {
    export default class Dot {
        readonly dom: HTMLElement;
        constructor(className?: string);
        setX(x: number): void;
    }
}
declare module "controls/thumbnail" {
    import Component from "component";
    import RPlayer from "rplayer";
    import ProgressBar from "controls/progress-bar";
    export interface ThumbnailImgBg {
        x: number;
        y: number;
        url: string;
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
    export default class Thumbnail extends Component {
        private readonly progressBar;
        private readonly time;
        private readonly img;
        private readonly opts;
        private readonly enableImg;
        private halfImgWidth;
        private thumbNumPerImg;
        private ssGapRatio;
        constructor(player: RPlayer, progressBar: ProgressBar);
        private getCurBg;
        update(left: number, seconds: number): void;
    }
}
declare module "controls/progress-bar" {
    import Component from "component";
    import RPlayer from "rplayer";
    export default class ProgressBar extends Component {
        private readonly barWrapper;
        private readonly bufBar;
        private readonly hoverBar;
        private readonly playedBar;
        private readonly dot;
        private readonly thumbnail;
        private readonly drag;
        private mouseMovePending;
        private mouseMoveLastX;
        private dragging;
        constructor(player: RPlayer);
        private calcCurrentTime;
        private dragStartHandler;
        private dragHandler;
        private dragEndHandler;
        private mouseMoveHandler;
        /**
         * @override
         */
        updateRect: () => void;
        updatePlayedBar(): void;
        updateBufBar(): void;
        updateHoverBarAndThumb: () => void;
        updateHoverBar(left: number): void;
        updateThumbnail(left: number): void;
        onControlsShow(): void;
        onTimeUpdate(): void;
        onProgress(): void;
        destroy(): void;
    }
}
declare module "config/lang" {
    export interface Language {
        [key: string]: Record<string, string>;
    }
    export const FULL_SCREEN = "Fullscreen";
    export const EXIT_FULL_SCREEN = "Exit fullscreen";
    export const SETTINGS = "Settings";
    export const PLAY = "Play";
    export const PAUSE = "Pause";
    export const MUTE = "Mute";
    export const UNMUTE = "Unmute";
    export const NORMAL = "Normal";
    export const SPEED = "Speed";
    export const CAPTIONS = "Captions";
    export const CLOSE = "Close";
    const language: Language;
    export default language;
}
declare module "icons" {
    const _default: {
        play(cls?: string): Element;
        pause(cls?: string): Element;
        enterFullscreen(cls?: string): Element;
        exitFullscreen(cls?: string): Element;
        volume(cls?: string): Element;
        muted(cls?: string): Element;
        settings(cls?: string): Element;
        cc(cls?: string): Element;
    };
    export default _default;
}
declare module "controls/trays/tray" {
    import Component from "component";
    import RPlayer from "rplayer";
    export interface TrayOpts {
        text?: string;
        icon?: string | Element;
        pos?: number;
        init?: (tray: Tray, player: RPlayer) => any;
        onClick?: (ev: MouseEvent) => any;
    }
    export default abstract class Tray extends Component {
        protected readonly tip: HTMLElement;
        pos: number;
        constructor(player?: RPlayer, tipText?: string, ...events: string[]);
        private __onclick;
        abstract onClick(ev?: MouseEvent): any;
        setLeft(): void;
        setRight(): void;
        changeTipText(text: string): void;
    }
    export class ConfigTray extends Tray {
        private readonly clickHandler;
        constructor(opts: TrayOpts, player: RPlayer);
        onClick(ev: MouseEvent): void;
    }
}
declare module "controls/setting/item" {
    export default abstract class SettingItem {
        entry: HTMLElement;
        protected entryLabel: HTMLElement;
        protected entryValue: HTMLElement;
        constructor(label: string);
        private entryClickHandler;
        abstract onEntryClick(ev: MouseEvent): void;
    }
}
declare module "index" {
    import '../scss/index.scss';
    import RPlayer from "rplayer";
    export { default as Events } from "events";
    export default RPlayer;
}
declare module "controls/setting/select" {
    import SettingItem from "controls/setting/item";
    import RPlayer from "index";
    export interface SelectOption {
        label: string;
        selectedLabel?: string;
        [key: string]: any;
    }
    export interface SelectChangeFn {
        (o: SelectOption, update: () => void): any;
    }
    export interface SelectOpts {
        label: string;
        options: SelectOption[];
        checked?: number;
        onChange?: SelectChangeFn;
    }
    export default class Select extends SettingItem {
        private readonly player;
        private prevSelect;
        private value;
        readonly dom: HTMLElement;
        readonly opts: SelectOpts;
        private readonly options;
        private readonly entryClickCb;
        constructor(player: RPlayer, opts: SelectOpts, entryClickCb?: (select: Select) => any);
        private optionClickHandler;
        select(index: number): void;
        onEntryClick(): void;
    }
}
declare module "controls/setting/switch" {
    import SettingItem from "controls/setting/item";
    export interface SwitchOpts {
        label: string;
        checked?: boolean;
        onChange?: (v: boolean, update: () => void, ev: MouseEvent) => any;
    }
    export default class Switch extends SettingItem {
        private value;
        private readonly opts;
        constructor(opts: SwitchOpts);
        private switch;
        onEntryClick(ev: MouseEvent): void;
    }
}
declare module "controls/setting/menu" {
    import Component from "component";
    import RPlayer from "rplayer";
    import Select, { SelectOpts } from "controls/setting/select";
    import Switch, { SwitchOpts } from "controls/setting/switch";
    export default class SettingMenu extends Component {
        private readonly homePage;
        private readonly optionPages;
        private homeRect;
        private readonly optionRects;
        constructor(player: RPlayer);
        private selectEntryClickHandler;
        private backClickHandler;
        private setWH;
        private getBack;
        private getOptionPage;
        addItem(opts: SelectOpts | SwitchOpts, pos?: number): Select | Switch;
        resetPage(): void;
        onSettingSelected(): void;
        onMounted(): void;
    }
}
declare module "controls/setting/index" {
    import RPlayer from "rplayer";
    import Tray from "controls/trays/tray";
    import SettingMenu from "controls/setting/menu";
    export default class Setting extends Tray {
        readonly menu: SettingMenu;
        private resetPageTimer;
        constructor(player: RPlayer);
        private hide;
        onClick(): void;
        onPlayerContextMenu(): void;
        onClickControlMask(): void;
        onClickOutside(): void;
    }
}
declare module "controls/trays/play" {
    import RPlayer from "rplayer";
    import Tray from "controls/trays/tray";
    export default class PlayTray extends Tray {
        constructor(player: RPlayer);
        onClick(): void;
        onPlay(): void;
        onPause(): void;
    }
}
declare module "controls/trays/time" {
    import Component from "component";
    import RPlayer from "rplayer";
    export default class Time extends Component {
        private readonly curTime;
        private readonly totalTime;
        pos: number;
        constructor(player: RPlayer);
        private updateCurTime;
        private updateTotalTime;
        onTimeUpdate(): void;
        onDurationChange(): void;
        onControlsShow(): void;
    }
}
declare module "controls/trays/volume" {
    import Component from "component";
    import RPlayer from "rplayer";
    export default class VolumeTray extends Component {
        private readonly icon;
        private readonly progress;
        pos: number;
        constructor(player: RPlayer);
        onVolumeChange(): void;
        onMounted(): void;
    }
}
declare module "controls/index" {
    import Component from "component";
    import RPlayer from "rplayer";
    import ContextMenu, { ContextMenuItem } from "controls/contextmenu";
    import Mask from "controls/mask";
    import Setting from "controls/setting/index";
    import { SelectOpts } from "controls/setting/select";
    import { SwitchOpts } from "controls/setting/switch";
    import SettingMenu from "controls/setting/menu";
    import Tray, { TrayOpts } from "controls/trays/tray";
    export default class Controls extends Component {
        private controlsTimer;
        private readonly bottom;
        private readonly tray;
        readonly mask: Mask;
        readonly contextMenu: ContextMenu;
        readonly setting: Setting;
        private showLatch;
        constructor(player: RPlayer);
        get isHide(): boolean;
        private tryHideControls;
        requireShow(): void;
        releaseShow(): void;
        showTemporary(): void;
        show(): void;
        hide(): void;
        addTray(tray: TrayOpts | Element, pos?: number): Tray | Element;
        addSettingItem(opts: SelectOpts | SwitchOpts, pos?: number): ReturnType<SettingMenu['addItem']>;
        addContextMenuItem(opts: ContextMenuItem, pos?: number): ReturnType<ContextMenu['addItem']>;
        onPlay(): void;
        onPause(): void;
        onPlayerClick(ev: Event): void;
        onPlayerMouseMove(): void;
        onPlayerMouseLeave(): void;
    }
}
declare module "handle-events" {
    import RPlayer from "rplayer";
    export default function handler(player: RPlayer, video: HTMLVideoElement): void;
}
declare module "plugins/subtitle" {
    import RPlayer from "rplayer";
    export interface SubtitleOpts {
        style?: Partial<CSSStyleDeclaration>;
        checked?: number;
        captions: HTMLTrackElement[];
    }
    export default class Subtitle {
        private readonly player;
        private tray;
        private items;
        private prev;
        private select;
        private readonly dom;
        constructor(player: RPlayer);
        private optionChangeHandler;
        private cueChangeHandler;
        private addCueEvent;
        private removeCueEvent;
        private run;
        renderText(text: string): void;
        show(): void;
        hide(): void;
        update(tracks: Partial<HTMLTrackElement>[], checked?: number): void;
        updateUI(style: SubtitleOpts['style']): void;
        toggle(): void;
    }
}
declare module "storage" {
    import { RPlayerOptions } from "options";
    export interface StorageOpts {
        enable?: boolean;
        key?: string;
    }
    export default class Storage {
        private key;
        private enable;
        constructor(opts: RPlayerOptions);
        static get supported(): boolean;
        get<T = string>(key?: string, orRet?: T): T;
        set(obj: Record<string, any>): void;
    }
}
declare module "shortcut" {
    import RPlayer from "rplayer";
    export type ShortcutHandler = (player: RPlayer) => any;
    export interface ShortcutOpts {
        enable?: boolean;
        time?: number;
        volume?: number;
        global?: boolean;
    }
    export default class Shortcut {
        private readonly player;
        private readonly handler;
        readonly editable: string[];
        constructor(player: RPlayer);
        private keydownHandler;
        register(code: number, fn: ShortcutHandler): void;
        unregister(code: number): void;
        enable(global?: boolean): void;
        disable(global?: boolean): void;
    }
}
declare module "options" {
    import { SelectOpts } from "controls/setting/select";
    import { SwitchOpts } from "controls/setting/switch";
    import { SubtitleOpts } from "plugins/subtitle";
    import RPlayer from "rplayer";
    import { StorageOpts } from "storage";
    import { ContextMenuOpts } from "controls/contextmenu";
    import { ShortcutOpts } from "shortcut";
    import { ThumbnailOpts } from "controls/thumbnail";
    import { TrayOpts } from "controls/trays/tray";
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
        trays?: TrayOpts[];
    }
    export default function processOptions(player: RPlayer, opts?: RPlayerOptions): RPlayerOptions;
}
declare module "i18n" {
    import { Language } from "config/lang";
    import { RPlayerOptions } from "options";
    export function fallback(): Language;
    export function t(key: string, lang: string): string;
    export default class I18n {
        lang: string;
        fallback: typeof fallback;
        constructor(opts: RPlayerOptions);
        t(key: string, lang?: string): string;
        addLang(lang: string, data: Record<string, string>): void;
    }
}
declare module "loading" {
    import EventHandler from "event-handler";
    import RPlayer from "rplayer";
    export default class Loading extends EventHandler {
        private readonly loadingClass;
        private showTimer;
        private startWaitingTime;
        constructor(player: RPlayer);
        private _checkCanplay;
        private checkCanplay;
        private tryShow;
        onCanplay(): void;
        onWaiting(): void;
        onStalled(): void;
        show: () => void;
        hide(): void;
    }
}
declare module "plugins/fullscreen" {
    import RPlayer from "rplayer";
    export default class Fullscreen {
        private readonly player;
        readonly prefix: string;
        constructor(player: RPlayer);
        private playerDblClickHandler;
        private changeHandler;
        private getPrefix;
        get requestFullscreen(): Function;
        get exitFullscreen(): Function;
        get fullscreenElement(): HTMLElement;
        get target(): HTMLElement;
        get isActive(): boolean;
        get support(): boolean;
        enter(): void;
        exit(): void;
        toggle(): void;
    }
}
declare module "rplayer" {
    import Component from "component";
    import Controls from "controls/index";
    import I18n from "i18n";
    import Loading from "loading";
    import { RPlayerOptions } from "options";
    import Subtitle from "plugins/subtitle";
    import Fullscreen from "plugins/fullscreen";
    import Shortcut from "shortcut";
    import Storage from "storage";
    export default class RPlayer extends Component {
        el: HTMLElement;
        curBreakPoint: string;
        readonly media: HTMLVideoElement;
        readonly options: RPlayerOptions;
        readonly fullscreen: Fullscreen;
        readonly controls: Controls;
        readonly shortcut: Shortcut;
        readonly i18n: I18n;
        readonly loading: Loading;
        readonly subtitle: Subtitle;
        storage: Storage;
        private prevVolume;
        constructor(opts: RPlayerOptions);
        get currentTime(): number;
        set currentTime(v: number);
        get volume(): number;
        set volume(v: number);
        get muted(): boolean;
        set muted(v: boolean);
        get playbackRate(): number;
        set playbackRate(v: number);
        get duration(): number;
        get buffered(): TimeRanges;
        get paused(): boolean;
        get isPhone(): boolean;
        private restore;
        setMediaAttrs(map: RPlayerOptions['video']): void;
        mount(el?: HTMLElement): void;
        seek(seconds: number): void;
        play(): void;
        pause(): void;
        toggle(): void;
        incVolume(v?: number): void;
        decVolume(v?: number): void;
        forward(v?: number): void;
        rewind(v?: number): void;
        toggleVolume(): void;
        t(key: string): string;
        eachBuffer(fn: (start: number, end: number) => boolean | void): void;
    }
}
declare module "event-handler" {
    import { EventEmitter } from 'eventemitter3';
    import RPlayer from "rplayer";
    export default class EventHandler extends EventEmitter {
        protected readonly player: RPlayer;
        constructor(player?: RPlayer, events?: string[]);
    }
}
declare module "component" {
    import EventHandler from "event-handler";
    import RPlayer from "rplayer";
    export interface ComponentOptions {
        player?: RPlayer;
        dom?: keyof HTMLElementTagNameMap | HTMLElement;
        events?: string[];
        autoUpdateRect?: boolean;
        className?: string;
    }
    export default class Component extends EventHandler {
        protected _rect: DOMRect;
        readonly dom: HTMLElement;
        constructor(player?: RPlayer, { dom, events, autoUpdateRect, className, }?: ComponentOptions);
        get rect(): DOMRect;
        get text(): string;
        set text(text: string);
        get html(): string;
        set html(html: string);
        private _resizeHandler;
        autoUpdateRect(player?: RPlayer): void;
        updateRect: () => void;
        addStyle(style: Partial<CSSStyleDeclaration> | string): void;
        appendChild(d: Node | Component): void;
        insert(d: Node | Component, pos?: number): void;
        removeChild(d: Node | Component): void;
        addClass(cls: string): void;
        containsClass(cls: string): boolean;
        toggleClass(cls: string, force?: boolean): void;
        removeClass(cls: string): void;
        appendTo(d: Node | Component): void;
        removeFrom(d: Node | Component): void;
        removeFromParent(): void;
        hidden(): void;
        visible(): void;
        canFocus(): void;
        static isComponent(obj: unknown): obj is Component;
    }
}
//# sourceMappingURL=index.d.ts.map