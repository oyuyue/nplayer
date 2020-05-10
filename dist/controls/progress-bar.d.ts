import Component from '../component';
import RPlayer from '../rplayer';
declare class ProgressBar extends Component {
    private readonly barWrapper;
    private readonly bufBar;
    private readonly hoverBar;
    private readonly playedBar;
    private readonly padBar;
    private readonly dot;
    private readonly thumbnail;
    private readonly drag;
    private mouseMovePending;
    private mouseMoveLastX;
    private dragging;
    constructor(player: RPlayer);
    private calcCurrentTime;
    private dragStartHandler;
    private dragHandler;
    private dragEndHandler;
    private mouseMoveHandler;
    /**
     * @override
     */
    updateRect: () => void;
    updatePlayedBar(): void;
    updateBufBar(): void;
    updateHoverBarAndThumb: () => void;
    updateHoverBar(left: number): void;
    updateThumbnail(left: number): void;
    onControlsShow(): void;
    onTimeUpdate(): void;
    onProgress(): void;
    destroy(): void;
}
export default ProgressBar;
