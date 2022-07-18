import { Player } from 'src/ts/player';
import { Component } from 'src/ts/utils';
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
