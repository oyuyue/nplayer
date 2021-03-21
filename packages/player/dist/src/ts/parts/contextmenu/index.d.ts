import { Player } from '../../player';
import { Component } from '../../utils';
export interface ContextMenuItem {
    id?: string;
    html?: string;
    disabled?: boolean;
    invisible?: boolean;
    checked?: boolean;
    init?: (item: ContextMenuItem, player: Player) => void;
    click?: (item: ContextMenuItem, player: Player) => void;
}
export declare class ContextMenu extends Component {
    private player;
    private items;
    private rect;
    constructor(container: HTMLElement, player: Player, items: ContextMenuItem[]);
    private getDomNodes;
    private renderItems;
}
