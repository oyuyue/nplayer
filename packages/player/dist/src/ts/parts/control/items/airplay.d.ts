import { Player } from '../../../player';
import { Component } from '../../../utils';
import { Tooltip } from '../../../components/tooltip';
export declare class AirplayControlItem extends Component {
    static readonly id = "airplay";
    readonly tip: Tooltip;
    constructor(container: HTMLElement, player: Player);
    static isSupport(): boolean;
}
