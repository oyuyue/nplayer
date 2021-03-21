import { Player } from '../../../player';
import { Component } from '../../../utils';
export declare class Progress extends Component {
    private player;
    private playedBar;
    private bufBar;
    private bars;
    private rect;
    private thumbnail;
    private dragging;
    constructor(container: HTMLElement, player: Player);
    private setPlayedBarLength;
    private setBufBarLength;
    private onDragStart;
    private onDragging;
    private onDragEnd;
    private updateThumbnail;
    private updateBufBar;
    private updatePlayedBar;
    private getCurrentTime;
}
