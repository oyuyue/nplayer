import { Player } from 'src/ts/player';
import { Component } from 'src/ts/utils';
import { ControlItem } from '..';
declare class Airplay extends Component implements ControlItem {
    readonly id = "airplay";
    tip: string;
    init(player: Player): void;
    isSupport(): boolean;
}
export declare const airplayControlItem: () => Airplay;
export {};
