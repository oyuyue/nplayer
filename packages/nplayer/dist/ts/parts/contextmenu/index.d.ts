import { Player } from 'src/ts/player';
import { Component } from 'src/ts/utils';
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
