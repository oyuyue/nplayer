import type { Danmaku } from '.';
export interface BulletOption {
    color?: string;
    text: string;
    time: number;
    type?: 'top' | 'bottom' | 'scroll';
    isMe?: boolean;
    force?: boolean;
}
export interface BulletSetting {
    track: number;
    prev?: Bullet;
}
export declare class Bullet {
    private danmaku;
    readonly element: HTMLElement;
    width: number;
    left: number;
    length: number;
    startAt: number;
    showAt: number;
    endAt: number;
    speed: number;
    track: number;
    type: string;
    ended: boolean;
    color: string;
    private centerTimer;
    constructor(container: HTMLElement, danmaku: Danmaku, opts: BulletOption, setting: BulletSetting);
    init(opts: BulletOption, setting: BulletSetting): this;
    private pos;
    updateScrollY(bottomUp?: boolean): void;
    end: () => void;
    show(): void;
    hide(): void;
    pause(time: number): void;
    run(time: number): void;
}
