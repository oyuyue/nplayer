import { Player } from '../player';
import { Disposable } from '../types';
export declare class Fullscreen implements Disposable {
    private player;
    private target;
    private readonly prefix;
    constructor(player: Player);
    private getPrefix;
    get requestFullscreen(): Element['requestFullscreen'];
    get exitFullscreen(): Document['exitFullscreen'];
    get fullscreenElement(): HTMLElement;
    get isActive(): boolean;
    private addClass;
    private removeClass;
    enableDblclick(): void;
    disableDblclick(): void;
    setTarget(dom?: HTMLElement, video?: HTMLVideoElement): void;
    enter(): void;
    exit(): boolean;
    toggle: () => void;
    dispose(): void;
}
