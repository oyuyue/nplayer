import { Player } from '../../../player';
import { Component } from '../../../utils';
import { Tooltip } from '../../../components/tooltip';
import { ControlItem } from '..';
declare class Volume extends Component implements ControlItem {
    private player;
    private readonly volumeIcon;
    private readonly mutedIcon;
    private readonly bar;
    private readonly rect;
    tooltip: Tooltip;
    constructor(player: Player);
    init(_: any, tooltip: Tooltip): void;
    private onDragStart;
    private onDragging;
    private onVolumeChange;
    mute(): void;
    unmute(): void;
}
declare const volumeControlItem: {
    (player: Player): Volume;
    id: string;
};
export { volumeControlItem };
