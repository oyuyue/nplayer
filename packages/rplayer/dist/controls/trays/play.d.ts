import RPlayer from '../../rplayer';
import EventHandler from '../../event-handler';
export default class PlayTray extends EventHandler {
    private readonly tray;
    readonly pos = 0;
    constructor(player: RPlayer);
    get dom(): HTMLElement;
    onClick: () => void;
    onPlay(): void;
    onPause(): void;
}
//# sourceMappingURL=play.d.ts.map