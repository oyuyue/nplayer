export interface TrayOptions {
    el?: string | HTMLElement;
    label?: string;
    labelPos?: 'left' | 'right';
    icons?: (Element | string)[];
    hoverBg?: boolean;
    onClick?: (i: number, ev: MouseEvent) => any;
}
export default class Tray {
    private static readonly disableCls;
    readonly dom: HTMLElement;
    readonly tip: HTMLElement;
    private readonly icons;
    private index;
    private readonly onClick;
    constructor(opts?: TrayOptions);
    private clickHandler;
    enable(): void;
    disable(): void;
    changeTip(tip: string): void;
    hideTip(): void;
    showTip(): void;
    showIcon(i?: number): void;
    mount(el?: string | HTMLElement): void;
    destroy(): void;
}
//# sourceMappingURL=tray.d.ts.map