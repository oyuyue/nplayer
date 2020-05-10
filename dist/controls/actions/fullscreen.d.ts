import RPlayer from '../../rplayer';
import Tray from '../tray';
declare class FullscreenAction extends Tray {
    constructor(player: RPlayer);
    onClick(): void;
    onEnterFullscreen(): void;
    onExitFullscreen(): void;
}
export default FullscreenAction;
