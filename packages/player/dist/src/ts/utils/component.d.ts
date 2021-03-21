import { Disposable } from '../types';
import { EventEmitter } from '.';
export declare class Component implements Disposable {
    element: HTMLElement;
    constructor(container?: HTMLElement, desc?: string, attrs?: {
        [key: string]: any;
    }, children?: string | Array<Node>, classPrefix?: string);
    applyStyle(style: Partial<CSSStyleDeclaration>): void;
    dispose(): void;
}
declare type IEventComponent = new (...args: ConstructorParameters<typeof Component>) => Component & EventEmitter;
export declare const EventComponent: IEventComponent;
export {};
