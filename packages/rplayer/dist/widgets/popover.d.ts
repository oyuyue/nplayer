import RPlayer from '..';
export interface PopoverOptions {
    el?: string | HTMLElement;
    left?: boolean;
    player?: RPlayer;
    onHide?: () => any;
    cls?: string;
}
export default class Popover {
    private static readonly activeCls;
    private readonly player;
    private readonly onHide;
    readonly dom: HTMLElement;
    constructor(opts?: PopoverOptions);
    get isActive(): boolean;
    show(): void;
    hide: () => void;
    append(d: string | HTMLElement): void;
    mount(el?: string | HTMLElement): void;
}
//# sourceMappingURL=popover.d.ts.map