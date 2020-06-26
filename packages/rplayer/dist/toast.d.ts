import RPlayer from '.';
export default class Toast {
    private static readonly activeCls;
    readonly dom: HTMLElement;
    private timer;
    constructor(player: RPlayer);
    private clearTimer;
    show(v: string | {
        message: string;
        duration: number;
    }): void;
    hide: () => void;
    destroy(): void;
}
//# sourceMappingURL=toast.d.ts.map