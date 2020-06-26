export interface SwitchOptions {
    defaultValue?: boolean;
    el?: string | HTMLElement;
    onChange?: (value: boolean, done: (success?: boolean) => any) => any;
    primaryColor?: string;
    small?: boolean;
}
export default class Switch {
    private static readonly activeCls;
    readonly dom: HTMLElement;
    private _value;
    private readonly color;
    private readonly onChange;
    constructor(opts?: SwitchOptions);
    get value(): boolean;
    set value(v: boolean);
    private clickHandler;
    private done;
    update(v?: boolean): void;
    mount(el?: string | HTMLElement): void;
    destroy(): void;
}
//# sourceMappingURL=switch.d.ts.map