import { Disposable } from '../types';
export declare class Rect implements Disposable {
    private element;
    private rect;
    constructor(element: HTMLElement);
    get width(): number;
    get height(): number;
    get x(): number;
    get y(): number;
    private tryUpdate;
    update(): void;
    dispose(): void;
}
