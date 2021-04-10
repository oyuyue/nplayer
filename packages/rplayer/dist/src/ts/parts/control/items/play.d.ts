import { Component } from '../../../utils';
import { Player } from '../../../player';
import { Tooltip } from '../../../components/tooltip';
export declare class PlayControlItem extends Component {
    static readonly id = "play";
    private playIcon;
    private pauseIcon;
    readonly tip: Tooltip;
    constructor(container: HTMLElement, player: Player);
    private onPlay;
    private onPause;
}
