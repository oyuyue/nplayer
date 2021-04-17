import type { Plugin as P, Player } from 'nplayer';
import { DanmakuOptions } from './danmaku';
export interface DanmakuPluginOption extends DanmakuOptions {
    autoInsertControl: boolean;
}
export declare class Plugin implements P {
    private opts;
    constructor(opts: DanmakuPluginOption);
    apply(player: Player): void;
}
