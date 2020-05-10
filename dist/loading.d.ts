import EventHandler from './event-handler';
import RPlayer from './rplayer';
declare class Loading extends EventHandler {
    private readonly loadingClass;
    private startWaitingTime;
    constructor(player: RPlayer);
    private _checkCanplay;
    private checkCanplay;
    onCanplay(): void;
    onWaiting(): void;
    onStalled(): void;
    show(): void;
    hide(): void;
}
export default Loading;
