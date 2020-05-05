import Component from '../component';
import RPlayer from '../rplayer';
import Bottom from './bottom';
declare class Controls extends Component {
    private controlsTimer;
    readonly bottom: Bottom;
    private readonly mask;
    private readonly hideClass;
    private showLatch;
    constructor(player: RPlayer);
    get isHide(): boolean;
    private initEvents;
    private delayHide;
    private tryHideControls;
    requireShow(): void;
    releaseShow(): void;
    show(): void;
    hide(): void;
    onPlay(): void;
    onPause(): void;
}
export default Controls;
