import RPlayer from '../../rplayer';
import Tray from '../tray';
declare class SettingAction extends Tray {
    private readonly menu;
    private resetPageTimer;
    private readonly activeClass;
    constructor(player: RPlayer);
    private hide;
    onClick(): void;
    onPlayerContextMenu(): void;
    onClickControlMask(): void;
    onClickOutside(): void;
}
export default SettingAction;
