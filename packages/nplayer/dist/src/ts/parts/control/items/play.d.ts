import { Component } from '../../../utils';
import { Player } from '../../../player';
import { Tooltip } from '../../../components/tooltip';
import { ControlItem } from '..';
declare class Play extends Component implements ControlItem {
    private playIcon;
    private pauseIcon;
    tooltip: Tooltip;
    constructor();
    init(player: Player, tooltip: Tooltip): void;
    private onPlay;
    private onPause;
}
declare const playControlItem: {
    (): Play;
    id: string;
};
export { playControlItem };
