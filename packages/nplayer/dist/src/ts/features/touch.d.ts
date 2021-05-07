import { Player } from '../player';
import { Disposable } from '../types';
export declare class Touch implements Disposable {
    private player;
    private startX;
    private startY;
    private dragType;
    private duration;
    private durationStr;
    private currentTime;
    private volume;
    private seekTime;
    private toastItem;
    private drag;
    private showControlTimer;
    private videoTouched;
    constructor(player: Player);
    private dragStart;
    private dragMove;
    private dragEnd;
    private videoTouchHandler;
    enable(): void;
    disable(): void;
    dispose(): void;
}
