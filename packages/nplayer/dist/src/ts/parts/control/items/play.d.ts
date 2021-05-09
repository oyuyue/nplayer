import { Component } from '../../../utils';
import { Player } from '../../../player';
import { Tooltip } from '../../../components/tooltip';
import { ControlItem } from '..';
declare class Play extends Component implements ControlItem {
    readonly id = "play";
    private playIcon;
    private pauseIcon;
    tooltip: Tooltip;
    init(player: Player, _: any, tooltip: Tooltip): void;
    private onPlay;
    private onPause;
}
export declare const playControlItem: () => Play;
export {};
