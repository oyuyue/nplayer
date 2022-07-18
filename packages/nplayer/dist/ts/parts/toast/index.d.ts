import { Disposable } from 'src/ts/types';
import { Component } from 'src/ts/utils';
declare type Position = 'center' | 'left-top' | 'right-top' | 'left-bottom' | 'right-bottom';
export declare class ToastItem extends Component {
    readonly position: Position;
    timer: any;
    constructor(container: HTMLElement, html: string, position?: Position);
    dispose(): void;
}
export declare class Toast implements Disposable {
    private toasts;
    private container;
    constructor(container: HTMLElement);
    show(html: string, position?: Position, timeout?: number): ToastItem;
    close(toastItem?: ToastItem): void;
    dispose(): void;
}
export {};
