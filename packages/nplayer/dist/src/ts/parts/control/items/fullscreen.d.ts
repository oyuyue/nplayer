import { Player } from '../../../player';
import { Component } from '../../../utils';
import { Tooltip } from '../../../components/tooltip';
import { ControlItem } from '..';
declare class Fullscreen extends Component implements ControlItem {
    readonly id = "fullscreen";
    private exitIcon;
    private enterIcon;
    tooltip: Tooltip;
    init(player: Player, _: boolean, tooltip: Tooltip): void;
    private enter;
    private exit;
}
export declare const fullscreenControlItem: () => Fullscreen;
export {};
