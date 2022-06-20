import { Player } from '../../../../../../../mnt/c/Users/wopen/Projects/rplayer/packages/nplayer/dist/src/ts/player';
import { Component } from '../../../../../../../mnt/c/Users/wopen/Projects/rplayer/packages/nplayer/dist/src/ts/utils';
export declare class Loading extends Component {
    private player;
    private showTimer;
    private startWaitingTime;
    constructor(container: HTMLElement, player: Player);
    get isActive(): boolean;
    private _checkCanplay;
    private checkCanplay;
    private tryShow;
    show: () => void;
    hide: () => void;
}
