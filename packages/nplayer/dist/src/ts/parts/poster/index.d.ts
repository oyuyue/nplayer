import { Player } from '../../../../../../../mnt/c/Users/wopen/Projects/rplayer/packages/nplayer/dist/src/ts/player';
import { Component } from '../../../../../../../mnt/c/Users/wopen/Projects/rplayer/packages/nplayer/dist/src/ts/utils';
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
