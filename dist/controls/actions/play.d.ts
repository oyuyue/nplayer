import RPlayer from '../../rplayer';
import Tray from '../tray';
declare class PlayAction extends Tray {
    constructor(player: RPlayer);
    onClick(): void;
    onPlay(): void;
    onPause(): void;
}
export default PlayAction;
