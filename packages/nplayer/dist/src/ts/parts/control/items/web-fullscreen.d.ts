import { Player } from '../../../player';
import { Component } from '../../../utils';
import { Tooltip } from '../../../components/tooltip';
import { ControlItem } from '..';
declare class WebFullscreen extends Component implements ControlItem {
    private readonly exitIcon;
    private readonly enterIcon;
    tooltip: Tooltip;
    constructor();
    init(player: Player, tooltip: Tooltip): void;
    private enter;
    private exit;
}
declare const webFullscreenControlItem: {
    (): WebFullscreen;
    id: string;
};
export { webFullscreenControlItem };
