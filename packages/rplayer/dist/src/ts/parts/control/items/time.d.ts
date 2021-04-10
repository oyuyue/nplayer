import { Player } from '../../../player';
import { Component } from '../../../utils';
export declare class TimeControlItem extends Component {
    static readonly id = "time";
    private readonly playedElement;
    private readonly totalElement;
    constructor(container: HTMLElement, player: Player);
    private set played(value);
    private set total(value);
}
