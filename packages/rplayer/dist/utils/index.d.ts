export { default as Drag } from './drag';
export declare function noop(): void;
export declare function clamp(n: number, lower?: number, upper?: number): number;
export declare function isStr(o: any): o is string;
export declare function isNum(o: any): o is number;
export declare function isFn(o: any): o is Function;
export declare function isObj(o: any): o is Record<string, any>;
export declare function isElement(o: any): o is Element;
export declare function isCatchable(o: any): o is {
    catch: Function;
};
export declare function clampNeg(n: number, max: number, defaults?: number): number;
export declare function findIndex<T>(arr: T[], predicate: (value: T, index: number, obj: T[]) => unknown): number;
export declare function getDomOr<T extends HTMLElement>(dom: HTMLElement | string, orReturn?: (() => T) | T): T;
export declare function htmlDom(html?: string, tag?: string, className?: string): HTMLElement;
export declare function measureElementSize(dom: HTMLElement): {
    width: number;
    height: number;
};
export declare function newElement<T extends HTMLElement>(className?: string, tag?: keyof HTMLElementTagNameMap): T;
export declare function strToDom(str: string, type?: SupportedType): HTMLElement;
export declare function svgToDom(str: string, className?: string): HTMLElement;
export declare function padStart(v: string | number, len?: number, str?: string): string;
export declare function formatTime(seconds: number): string;
export declare const ua: {
    isEdge: boolean;
    isIos: boolean;
    isIE: boolean;
};
export declare const makeDictionary: <T>(obj: T) => T;
export declare const getClientWH: () => [number, number];
export declare const safeJsonParse: <T extends Record<string, any>>(str: string, orRet?: T) => string | T;
export declare const safeJsonStringify: (obj: Record<string, any>, orRet?: string) => string;
export declare const extend: (target: Record<string, any>, source: Record<string, any>) => Record<string, any>;
export declare const ajax: (url: string, cb: (err: any, data?: string) => any) => void;
//# sourceMappingURL=index.d.ts.map