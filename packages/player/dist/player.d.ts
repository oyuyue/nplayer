import EventEmitter from 'eventemitter3';

declare class ContextItem {
}

declare class MenuItem {
    readonly player: Player;
    readonly dom: HTMLDivElement;
    constructor(player: Player);
    static withTip(dom: HTMLElement): MenuItemTip;
    static withHover(dom: HTMLElement): void;
    appendChild<T extends Node>(newChild: T): T;
    init(): void;
    mounted(index: number): void;
    unmounted(index: number): void;
}

declare class MenuItemTip {
    readonly dom: HTMLDivElement;
    constructor(parentNode: HTMLElement);
    get html(): string;
    set html(html: string);
}

declare class Player extends EventEmitter {
    private el;
    private readonly video;
    private opts;
    private readonly contentLayer;
    readonly dom: HTMLElement;
    menuItems: MenuItem[];
    contextItems: ContextItem[];
    constructor(opts: PlayerOptions);
    toast(html: string): void;
    mount(el?: PlayerOptions['el']): void;
}
export default Player;

declare interface PlayerOptions {
    el?: HTMLElement | string;
    video?: HTMLVideoElement;
}

export { }
