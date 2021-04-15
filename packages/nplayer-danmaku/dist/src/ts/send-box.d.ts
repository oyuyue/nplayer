import type { ControlItem, Player, Tooltip } from 'nplayer';
declare class DanmakuSendBox implements ControlItem {
    private player;
    static readonly id = "danmaku";
    element: HTMLElement;
    readonly tooltip: Tooltip;
    private readonly popover;
    private readonly inputElement;
    private readonly sendElement;
    private readonly colorInputElement;
    private readonly colorElement;
    private readonly typeCBs;
    private currentType;
    constructor(player: Player);
    private onTypeChange;
    updateColor(v: string): void;
    show: (ev?: MouseEvent | undefined) => void;
    send: () => void;
    dispose(): void;
}
declare const danmakuSendBoxControlItem: {
    (player: Player): DanmakuSendBox;
    id: string;
};
export { danmakuSendBoxControlItem };
