import Component from '../component';
import RPlayer from '../rplayer';
export interface ContextMenuItem {
    icon?: string | Element;
    label?: string | Element;
    checked?: boolean;
    onClick?: (checked: boolean, update: () => void, ev: MouseEvent) => any;
}
export interface ContextMenuOpts {
    toggle?: boolean;
    enable?: boolean;
    items?: ContextMenuItem[];
}
export declare class MenuItem {
    readonly dom: HTMLElement;
    private checked;
    private readonly cb;
    constructor(item: ContextMenuItem);
    private next;
    update(): void;
    clickHandler: (ev: MouseEvent) => void;
}
export default class ContextMenu extends Component {
    private showed;
    private enable;
    private toggle;
    constructor(player: RPlayer);
    hide(): void;
    show(): void;
    clickHandler: (ev: MouseEvent) => void;
    addItem(opts: ContextMenuItem, pos?: number): MenuItem;
    onPlayerContextMenu(ev: MouseEvent): void;
    onClickOutside(): void;
    onClickControlMask(): void;
}
//# sourceMappingURL=contextmenu.d.ts.map