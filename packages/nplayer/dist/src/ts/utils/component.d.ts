import { Disposable } from '../types';
export declare class Component implements Disposable {
    el: HTMLElement;
    constructor(container?: HTMLElement, desc?: string | HTMLElement, attrs?: {
        [key: string]: any;
    }, children?: string | Array<Node>, classPrefix?: string);
    applyStyle(style: Partial<CSSStyleDeclaration>): void;
    dispose(): void;
}
