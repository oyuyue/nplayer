import { Player } from '../../player';
import { Component } from '../../utils';
export declare class Poster extends Component {
    private player;
    private playElement;
    private poster;
    private tryToPlayed;
    constructor(container: HTMLElement, player: Player);
    private addTimeUpdateHandler;
    private onTimeUpdate;
    show(): void;
    hide: () => void;
}
