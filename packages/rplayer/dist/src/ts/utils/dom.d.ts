import { Disposable } from '../types';
export declare function $<T extends HTMLElement>(desc?: string, attrs?: {
    [key: string]: any;
}, children?: string | Array<Node>, classPrefix?: string): T;
export declare function getEl(el: HTMLElement | string | undefined | null): HTMLElement | null;
export declare function strToDom(str: string, type?: DOMParserSupportedType): HTMLElement;
export declare function removeNode(node: Element): void;
export declare function show(node: HTMLElement): void;
export declare function hide(node: HTMLElement): void;
export declare function addClass(dom: HTMLElement, cls?: string, prefix?: string): HTMLElement;
export declare function removeClass(dom: HTMLElement, cls: string, prefix?: string): HTMLElement;
export declare function containClass(dom: HTMLElement, cls: string, prefix?: string): boolean;
export declare function toggleClass(dom: HTMLElement, cls: string, force?: boolean, prefix?: string): boolean;
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
