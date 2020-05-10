import RPlayer from '../../rplayer';
import Tray from '../tray';
declare class SettingAction extends Tray {
    private readonly menu;
    private readonly mask;
    private resetPageTimer;
    private readonly activeClass;
    constructor(player: RPlayer);
    private maskClickHandler;
    onClick(): void;
}
export default SettingAction;
