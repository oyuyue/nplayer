import { Player } from '../../../player';
import { Component } from '../../../utils';
import { ControlItem } from '..';
export declare class ControlBar extends Component {
    private player;
    private position;
    private prevItems;
    private spacer;
    constructor(container: HTMLElement, player: Player, items?: (ControlItem | string)[], position?: number);
    private getItem;
    private initControlItem;
    private onHideControlItem;
    updateTooltipPos(): void;
    getItems(): ControlItem[];
    setItems(items?: ControlItem[]): void;
    update(nextItems: (string | ControlItem)[]): void;
}
