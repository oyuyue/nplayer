export interface CheckboxOptions {
    defaultValue?: boolean;
    el?: string | HTMLElement;
    onChange?: (value: boolean, done: (success?: boolean) => any) => any;
    label?: string;
    primaryColor?: string;
}
export default class Checkbox {
    private static readonly activeCls;
    readonly dom: HTMLElement;
    private _value;
    private onChange;
    private color;
    constructor(opts?: CheckboxOptions);
    get value(): boolean;
    set value(v: boolean);
    private clickHandler;
    private done;
    update(v?: boolean): void;
    mount(el?: string | HTMLElement): void;
    destroy(): void;
}
//# sourceMappingURL=checkbox.d.ts.map