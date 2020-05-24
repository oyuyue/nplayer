import RPlayer from '../../rplayer';
import Tray from './tray';
export default class PlayTray extends Tray {
    constructor(player: RPlayer);
    onClick(): void;
    onPlay(): void;
    onPause(): void;
}
