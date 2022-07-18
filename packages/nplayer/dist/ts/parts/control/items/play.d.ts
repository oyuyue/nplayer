import { Component } from 'src/ts/utils';
import { Player } from 'src/ts/player';
import { Tooltip } from 'src/ts/components/tooltip';
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
