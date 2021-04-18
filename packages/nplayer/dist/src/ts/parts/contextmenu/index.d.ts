import { Player } from '../../player';
import { Component } from '../../utils';
export interface ContextMenuItem {
    id?: string;
    html?: string;
    disabled?: boolean;
    invisible?: boolean;
    checked?: boolean;
    init?: (player: Player, item: ContextMenuItem) => void;
    show?: (player: Player, item: ContextMenuItem) => void;
    click?: (player: Player, item: ContextMenuItem) => void;
}
export declare class ContextMenu extends Component {
    private player;
    private items;
    private rect;
    private showed;
    constructor(container: HTMLElement, player: Player, items: ContextMenuItem[]);
    private getDomNodes;
    private renderItems;
    get isActive(): boolean;
    hide: () => void;
}
