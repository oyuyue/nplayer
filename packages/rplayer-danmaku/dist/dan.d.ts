import { Item } from './options';
import Danmaku from '.';
export default class Dan {
    private readonly danmaku;
    readonly dom: HTMLElement;
    private type;
    private tunnel;
    private length;
    private showFrame;
    private _width;
    speed: number;
    canRecycle: boolean;
    constructor(danmaku: Danmaku, item: Item, tunnel: number, length?: number, speed?: number);
    get width(): number;
    get invisibleLength(): number;
    private measure;
    reset(item: Item, tunnel: number, length?: number, speed?: number): this;
    updateVertical(): void;
    private updateX;
    private show;
    private hide;
    update(): void;
    recycle(): void;
    destroy(): void;
}
//# sourceMappingURL=dan.d.ts.map