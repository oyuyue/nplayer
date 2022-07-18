import { Player } from 'src/ts/player';
import { Component } from 'src/ts/utils';
import { Tooltip } from 'src/ts/components/tooltip';
import { ControlItem } from '..';
declare class Volume extends Component implements ControlItem {
    readonly id = "volume";
    private player;
    private volumeIcon;
    private mutedIcon;
    private bar;
    private rect;
    private isVer;
    tooltip: Tooltip;
    init(player: Player, _: any, tooltip: Tooltip): void;
    private onDragStart;
    private onDragging;
    private onVolumeChange;
    mute(): void;
    unmute(): void;
}
export declare const volumeControlItem: () => Volume;
export {};
