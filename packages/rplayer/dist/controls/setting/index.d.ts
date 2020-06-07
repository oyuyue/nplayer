import RPlayer from '../../rplayer';
import Tray from '../trays/tray';
import SettingMenu from './menu';
export default class Setting extends Tray {
    readonly menu: SettingMenu;
    private resetPageTimer;
    constructor(player: RPlayer);
    private hide;
    onClick(): void;
    onPlayerContextMenu(): void;
    onClickControlMask(): void;
    onClickOutside(): void;
}
//# sourceMappingURL=index.d.ts.map