import type { ControlItem, Player, Tooltip } from 'nplayer';
declare class DanmakuSendBox implements ControlItem {
    readonly id = "danmaku";
    element: HTMLElement;
    private player;
    tooltip: Tooltip;
    private popover;
    private inputElement;
    private sendElement;
    private colorInputElement;
    private colorElement;
    private typeCBs;
    private currentType;
    init(player: Player): void;
    private onTypeChange;
    updateColor(v: string): void;
    show: (ev?: MouseEvent | undefined) => void;
    send: () => void;
    dispose(): void;
}
export declare const danmakuSendBoxControlItem: () => DanmakuSendBox;
export {};
