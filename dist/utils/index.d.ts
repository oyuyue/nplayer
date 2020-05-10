export { default as Drag } from './drag';
export declare function noop(): void;
export declare function clamp(n: number, lower?: number, upper?: number): number;
export declare function isStr(o: any): o is string;
export declare function isNum(o: any): o is number;
export declare function isFn(o: any): o is Function;
export declare function isObj(o: any): o is Record<string, any>;
export declare function isCatchable(o: any): o is {
    catch: Function;
};
export declare function findIndex<T>(arr: T[], predicate: (value: T, index: number, obj: T[]) => unknown): number;
export declare function getDomOr<T extends HTMLElement>(dom: HTMLElement | string, orReturn?: (() => T) | T): T;
export declare function htmlDom(html: string, tag?: string): HTMLElement;
export declare function measureElementSize(dom: HTMLElement): {
    width: number;
    height: number;
};
export declare function newElement<T extends HTMLElement>(tag?: keyof HTMLElementTagNameMap, className?: string): T;
export declare function strToDom(str: string, type?: SupportedType): HTMLElement;
export declare function svgToDom(str: string, className?: string): HTMLElement;
export declare function padStart(v: string | number, len?: number, str?: string): string;
export declare function formatTime(seconds: number): string;
export declare const ua: {
    isIos: boolean;
};
export declare const makeDictionary: <T>(obj: T) => T;
