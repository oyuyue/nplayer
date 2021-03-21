import { Player } from '../../../player';
import { Component } from '../../../utils';
import { Tooltip } from '../../../components/tooltip';
export declare class VolumeControlItem extends Component {
    private player;
    static readonly id = "volume";
    private readonly volumeIcon;
    private readonly mutedIcon;
    readonly tip: Tooltip;
    private readonly bar;
    private readonly rect;
    constructor(container: HTMLElement, player: Player, barWidth?: number);
    private onDragStart;
    private onDragging;
    private onVolumeChange;
    mute(): void;
    unmute(): void;
}
