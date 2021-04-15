import { Player } from '../../../player';
import { Component } from '../../../utils';
import { ControlItem } from '..';
declare class Time extends Component implements ControlItem {
    private readonly playedElement;
    private readonly totalElement;
    constructor(player: Player);
    private set played(value);
    private set total(value);
}
declare const timeControlItem: {
    (player: Player): Time;
    id: string;
};
export { timeControlItem };
