export interface PopoverOptions {
    el?: string | HTMLElement;
    left?: boolean;
}
export default class Popover {
    private static readonly activeCls;
    readonly dom: HTMLElement;
    constructor(opts?: PopoverOptions);
    show(): void;
    hide(): void;
    mount(el?: string | HTMLElement): void;
}
//# sourceMappingURL=popover.d.ts.map