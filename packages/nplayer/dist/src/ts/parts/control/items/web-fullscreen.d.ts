import { Player } from '../../../../../../../../mnt/c/Users/wopen/Projects/rplayer/packages/nplayer/dist/src/ts/player';
import { Component } from '../../../../../../../../mnt/c/Users/wopen/Projects/rplayer/packages/nplayer/dist/src/ts/utils';
import { Tooltip } from '../../../../../../../../mnt/c/Users/wopen/Projects/rplayer/packages/nplayer/dist/src/ts/components/tooltip';
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
