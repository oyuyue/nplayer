export interface Node {
    id?: any;
    el: HTMLElement;
}
export declare function patch(prevNodes: Node[], nextNodes: Node[], container: HTMLElement, op?: {
    mount?: (node: Node) => void;
    update?: (node: Node) => void;
    unmount?: (node: Node) => void;
}): void;
declare type CSSStyle = Partial<CSSStyleDeclaration>;
declare type Data = Record<string, any>;
export declare function patchStyles(el: HTMLElement, prevStyle: CSSStyle, nextStyle?: CSSStyle): void;
export declare function patchProps(el: HTMLElement, prevProps: Data, nextProps?: Data): void;
export {};
