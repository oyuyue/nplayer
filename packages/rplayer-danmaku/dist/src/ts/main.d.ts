import type { Plugin as P, Player } from 'rplayer';
import { DanmakuOptions } from './danmaku';
export declare class Plugin implements P {
    private opts;
    constructor(opts: DanmakuOptions);
    apply(player: Player): void;
}
