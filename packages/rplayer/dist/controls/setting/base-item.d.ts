export interface BaseItemOptions {
    onClick?: (ev: MouseEvent) => any;
    noHoverBg?: boolean;
    cls?: string;
}
export default class BaseItem {
    readonly dom: HTMLElement;
    private onClick;
    constructor(opts?: BaseItemOptions);
    private clickHandler;
    append(e: Element | string): void;
    destroy(): void;
}
//# sourceMappingURL=base-item.d.ts.map