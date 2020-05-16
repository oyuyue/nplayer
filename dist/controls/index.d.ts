import Component from '../component';
import RPlayer from '../rplayer';
import Bottom from './bottom';
import ContextMenu from './contextmenu';
import Mask from './mask';
declare class Controls extends Component {
    private controlsTimer;
    readonly bottom: Bottom;
    readonly mask: Mask;
    readonly contextMenu: ContextMenu;
    private readonly hideClass;
    private readonly pausedClass;
    private showLatch;
    constructor(player: RPlayer);
    get isHide(): boolean;
    private tryHideControls;
    requireShow(): void;
    releaseShow(): void;
    showTemporary(): void;
    show(): void;
    hide(): void;
    onPlay(): void;
    onPause(): void;
    onPlayerClick(ev: Event): void;
    onPlayerMouseMove(): void;
    onPlayerMouseLeave(): void;
}
export default Controls;
