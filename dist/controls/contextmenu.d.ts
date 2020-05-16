import Component from '../component';
import RPlayer from '../rplayer';
declare class ContextMenu extends Component {
    private showed;
    private opts;
    constructor(player: RPlayer);
    hide(): void;
    show(): void;
    clickHandler: (ev: MouseEvent) => void;
    onPlayerContextMenu(ev: MouseEvent): void;
    onClickOutside(): void;
    onClickControlMask(): void;
}
export default ContextMenu;
