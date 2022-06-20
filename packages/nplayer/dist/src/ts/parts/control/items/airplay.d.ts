import { Player } from '../../../../../../../../mnt/c/Users/wopen/Projects/rplayer/packages/nplayer/dist/src/ts/player';
import { Component } from '../../../../../../../../mnt/c/Users/wopen/Projects/rplayer/packages/nplayer/dist/src/ts/utils';
import { ControlItem } from '..';
declare class Airplay extends Component implements ControlItem {
    readonly id = "airplay";
    tip: string;
    init(player: Player): void;
    isSupport(): boolean;
}
export declare const airplayControlItem: () => Airplay;
export {};
