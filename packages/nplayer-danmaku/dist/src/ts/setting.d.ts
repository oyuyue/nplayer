import type { Player, Tooltip, ControlItem } from 'nplayer';
declare class DanmakuSetting implements ControlItem {
    readonly id = "danmaku-settings";
    private player;
    el: HTMLElement;
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
    init(player: Player, positoin: number): void;
    update(positoin: number): void;
    private setPos;
    updateSettings(): void;
    show: () => void;
    dispose(): void;
}
export declare const danmakuSettingControlItem: () => DanmakuSetting;
export {};
