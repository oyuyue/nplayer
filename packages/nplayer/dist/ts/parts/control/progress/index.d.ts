import { Player } from 'src/ts/player';
import { Component } from 'src/ts/utils';
import { ControlItem } from '..';
export declare class Progress extends Component implements ControlItem {
    readonly id = "progress";
    private playedBar;
    private bufBar;
    private bars;
    private dot;
    private rect;
    private thumbnail;
    private player;
    private dragging;
    init(player: Player): void;
    private resetPlayedBar;
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
export declare const progressControlItem: () => Progress;
