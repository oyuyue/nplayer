import { Player } from '../player';
import { Disposable } from '../types';
export declare type ShortcutHandler = (player: Player) => void;
export declare class Shortcut implements Disposable {
    private player;
    private map;
    constructor(player: Player, enable: boolean);
    private onKeyDown;
    register(keyCode: number, handler: ShortcutHandler): void;
    unregister(keyCode: number): boolean;
    dispose(): void;
    enable(): void;
    disable(): void;
}
