import { Player } from '../../../player';
import { Component } from '../../../utils';
import { ControlItem } from '..';
declare class Time extends Component implements ControlItem {
    readonly id = "time";
    private playedEl;
    private totalEl;
    init(player: Player): void;
    private set played(value);
    private set total(value);
}
export declare const timeControlItem: () => Time;
export {};
