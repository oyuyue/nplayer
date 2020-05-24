import EventHandler from './event-handler';
import RPlayer from './rplayer';
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
