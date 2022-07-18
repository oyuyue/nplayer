import { Player } from 'src/ts/player';
import { Component } from 'src/ts/utils';
import { Tooltip } from 'src/ts/components/tooltip';
import { ControlItem } from '..';
declare class WebFullscreen extends Component implements ControlItem {
    readonly id = "web-fullscreen";
    private exitIcon;
    private enterIcon;
    tooltip: Tooltip;
    init(player: Player, _: any, tooltip: Tooltip): void;
    private enter;
    private exit;
}
export declare const webFullscreenControlItem: () => WebFullscreen;
export {};
