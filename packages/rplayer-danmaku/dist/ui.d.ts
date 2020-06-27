import Danmaku from '.';
export default class UI {
    private static readonly trayActiveCls;
    private readonly tray;
    private readonly popover;
    private readonly danmaku;
    private readonly dom;
    constructor(danmaku: Danmaku);
    private onOnOffChange;
    private onTrayClick;
    private onTrayHide;
    render(): void;
    private newSettingItem;
    private newSettingLabel;
    private initPopover;
}
//# sourceMappingURL=ui.d.ts.map