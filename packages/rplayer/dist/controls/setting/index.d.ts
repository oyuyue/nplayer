import RPlayer from '../../rplayer';
import SettingMenu from './menu';
import EventHandler from '../../event-handler';
export default class Setting extends EventHandler {
    readonly menu: SettingMenu;
    private readonly tray;
    private resetPageTimer;
    readonly pos = 3;
    constructor(player: RPlayer);
    get dom(): HTMLElement;
    private onHide;
    private onClick;
}
//# sourceMappingURL=index.d.ts.map