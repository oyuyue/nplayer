import type { Player, Tooltip, ControlItem } from 'nplayer';
declare class DanmakuSetting implements ControlItem {
    private player;
    readonly element: HTMLElement;
    readonly tooltip: Tooltip;
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
    constructor(player: Player);
    update(): void;
    show: () => void;
    dispose(): void;
}
declare const danmakuSettingControlItem: {
    (player: Player): DanmakuSetting;
    id: string;
};
export { danmakuSettingControlItem };
