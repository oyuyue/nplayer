import { Player } from '../../../player';
import { Component } from '../../../utils';
import { ControlItem } from '..';
export declare class ControlBar extends Component {
    private player;
    private isTop;
    private prevItems;
    private spacer;
    constructor(container: HTMLElement, player: Player, items?: (ControlItem | string)[], isTop?: boolean);
    private getItem;
    private initControlItem;
    updateTooltipPos(): void;
    getItems(): ControlItem[];
    setItems(items?: ControlItem[]): void;
    update(nextItems: (string | ControlItem)[]): void;
}
