import { Item } from './options';
import Danmaku from './danmaku';
export default class Bullet {
    private static readonly CENTER_CLS;
    private static readonly ME_CLS;
    private readonly danmaku;
    readonly dom: HTMLElement;
    item: Item;
    private width;
    private length;
    private destination;
    private lastX;
    startTime: number;
    showTime: number;
    endTime: number;
    tunnel: number;
    running: boolean;
    canRecycle: boolean;
    constructor(danmaku: Danmaku, item: Item, tunnel: number, currentTime: number, prevBullet?: Bullet);
    get isScroll(): boolean;
    reset(item: Item, tunnel: number, currentTime: number, prevBullet?: Bullet): this;
    private onTransitionEnd;
    private setTransform;
    private setTransition;
    recycle(): this;
    updateTop(): void;
    show(): void;
    hide(): void;
    pause(time: number): void;
    destroy(): void;
    update(time: number): boolean;
}
//# sourceMappingURL=bullet.d.ts.map