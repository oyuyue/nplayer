import type { Disposable, Player, Tooltip } from 'rplayer';
export declare class DanmakuSendBoxControlItem implements Disposable {
    private player;
    static readonly id = "danmaku";
    private element;
    readonly tip: Tooltip;
    private readonly popover;
    private readonly inputElement;
    private readonly sendElement;
    private readonly colorInputElement;
    private readonly colorElement;
    private readonly typeCBs;
    private currentType;
    constructor(container: HTMLElement, player: Player);
    private onTypeChange;
    updateColor(v: string): void;
    show: (ev?: MouseEvent | undefined) => void;
    send: () => void;
    dispose(): void;
}
