import { Player } from '../player';
import { Disposable } from '../types';
export declare class Touch implements Disposable {
    private player;
    private startX;
    private duration;
    private durationStr;
    private currentTime;
    private seekTime;
    private toastItem;
    private showControlTimer;
    private videoTouched;
    private dragged;
    constructor(player: Player);
    private onTouchStart;
    private onTouchMove;
    private onTouchEnd;
    enable(): void;
    disable(): void;
    dispose(): void;
}
