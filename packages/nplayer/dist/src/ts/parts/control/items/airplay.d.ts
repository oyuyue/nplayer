import { Player } from '../../../player';
import { Component } from '../../../utils';
import { ControlItem } from '..';
declare class Airplay extends Component implements ControlItem {
    tip: string;
    constructor(player: Player);
    isSupport(): boolean;
}
declare const airplayControlItem: {
    (player: Player): Airplay;
    id: string;
};
export { airplayControlItem };
