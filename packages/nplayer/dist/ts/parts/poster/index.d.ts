import { Player } from 'src/ts/player';
import { Component } from 'src/ts/utils';
export declare class Poster extends Component {
    private player;
    private playEl;
    private poster;
    private tryToPlayed;
    constructor(container: HTMLElement, player: Player);
    private addTimeUpdateHandler;
    private onTimeUpdate;
    private tryHide;
    get isActive(): boolean;
    show(): void;
    hide(): void;
}
