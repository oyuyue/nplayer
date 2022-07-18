import { Disposable } from '../types';
declare type Fn = (ev: PointerEvent) => any;
export declare class Drag implements Disposable {
    private el;
    private start;
    private move;
    private end;
    private pending;
    private lastEv;
    constructor(dom: HTMLElement, start: Fn, move: Fn, end?: Fn);
    private downHandler;
    private moveHandler;
    private handlerMove;
    private upHandler;
    dispose(): void;
}
export {};
