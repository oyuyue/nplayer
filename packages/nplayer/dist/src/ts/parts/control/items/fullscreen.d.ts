import { Player } from '../../../player';
import { Component } from '../../../utils';
import { Tooltip } from '../../../components/tooltip';
import { ControlItem } from '..';
declare class Fullscreen extends Component implements ControlItem {
    private readonly exitIcon;
    private readonly enterIcon;
    tooltip: Tooltip;
    constructor();
    init(player: Player, tooltip: Tooltip): void;
    private enter;
    private exit;
}
declare const fullscreenControlItem: {
    (): Fullscreen;
    id: string;
};
export { fullscreenControlItem };
