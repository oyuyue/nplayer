import type { ControlItem, Player, Tooltip } from 'nplayer';
declare class DanmakuSendBox implements ControlItem {
    readonly id = "danmaku-send";
    el: HTMLElement;
    private player;
    tooltip: Tooltip;
    private popover;
    private inputEl;
    private sendEl;
    private colorInputEl;
    private colorEl;
    private typeCBs;
    private currentType;
    init(player: Player, positoin: number): void;
    update(positoin: number): void;
    private setPos;
    private onTypeChange;
    updateColor(v: string): void;
    show: (ev?: MouseEvent | undefined) => void;
    send: () => void;
    dispose(): void;
}
export declare const danmakuSendBoxControlItem: () => DanmakuSendBox;
export {};
