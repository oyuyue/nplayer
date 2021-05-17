import type { Plugin as P, Player } from 'nplayer';
import { DanmakuOptions } from './danmaku';
export interface DanmakuPluginOption extends DanmakuOptions {
    autoInsert: boolean;
}
export declare class Plugin implements P {
    private opts;
    constructor(opts: DanmakuPluginOption);
    apply(player: Player): void;
    static Plugin: typeof Plugin;
}
