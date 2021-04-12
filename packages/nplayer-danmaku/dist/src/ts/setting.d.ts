import type { Player, Tooltip, Disposable } from 'nplayer';
export declare class DanmakuSettingControlItem implements Disposable {
    private player;
    static readonly id = "danmaku-setting";
    private readonly element;
    readonly tip: Tooltip;
    private readonly popover;
    private scrollCB;
    private topCB;
    private bottomCB;
    private colorCB;
    private unlimitedCB;
    private bottomUpCB;
    private opacitySlider;
    private areaSlider;
    private speedSlider;
    private fontsizeSlider;
    constructor(container: HTMLElement, player: Player);
    update(): void;
    show: () => void;
    dispose(): void;
}
