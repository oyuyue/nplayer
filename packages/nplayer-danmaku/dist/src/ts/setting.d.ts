import type { Player, Tooltip, ControlItem } from 'nplayer';
declare class DanmakuSetting implements ControlItem {
    readonly id = "danmaku-setting";
    private player;
    element: HTMLElement;
    tooltip: Tooltip;
    private popover;
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
    init(player: Player): void;
    update(): void;
    show: () => void;
    dispose(): void;
}
export declare const danmakuSettingControlItem: () => DanmakuSetting;
export {};
