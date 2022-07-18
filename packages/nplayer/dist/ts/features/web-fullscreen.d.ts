import { Player } from '../player';
import { Disposable } from '../types';
export declare class WebFullscreen implements Disposable {
    private player;
    constructor(player: Player);
    get isActive(): boolean;
    enter(): void;
    exit(): boolean;
    toggle: () => void;
    dispose(): void;
}
