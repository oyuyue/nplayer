import { Disposable } from '../types';
export declare function $<T extends HTMLElement>(desc?: string, attrs?: {
    [key: string]: any;
}, children?: string | Array<Node>, classPrefix?: string): T;
export declare function getEl(el: HTMLElement | string | undefined | null): HTMLElement | null;
export declare function removeNode(node: Element): void;
export declare function show(node: HTMLElement | SVGElement): void;
export declare function hide(node: HTMLElement | SVGElement): void;
export declare function addClass<T extends Element>(dom: T, cls?: string, prefix?: string): T;
export declare function removeClass<T extends Element>(dom: T, cls: string, prefix?: string): T;
export declare function containClass(dom: Element, cls: string, prefix?: string): boolean;
export declare function toggleClass(dom: Element, cls: string, force?: boolean, prefix?: string): boolean;
export declare function createSvg(cls?: string, d?: string, viewBox?: string): SVGSVGElement;
export declare function getEventPath(ev: Event): EventTarget[];
export declare function isListenerObjOptsSupported(): boolean;
export declare class DomListener implements Disposable {
    private node;
    private type;
    private handler;
    private options?;
    constructor(node: EventTarget, type: string, handler: (e: any) => void, options?: boolean | AddEventListenerOptions | undefined);
    dispose(): void;
}
export declare function measureElementSize(dom: HTMLElement): {
    width: number;
    height: number;
};
