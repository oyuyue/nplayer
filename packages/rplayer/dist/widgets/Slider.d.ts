export interface SliderOptions {
    defaultValue?: number;
    onChange?: (value: number, done: (success?: boolean) => any) => any;
    map?: (value: number) => any;
    tip?: boolean;
    el?: string | HTMLElement;
    stop?: boolean;
    stops?: {
        value: number;
        label: string;
    }[];
    primaryColor?: string;
    bgColor?: string;
    labelColor?: string;
    barHeight?: number;
}
export default class Slider {
    readonly dom: HTMLElement;
    private readonly dot;
    private readonly bar;
    private readonly tip;
    private readonly drag;
    private readonly stops;
    private _rect;
    private prevValue;
    private readonly onChange;
    private readonly map;
    private showTip;
    private _value;
    private hdw;
    constructor(opts?: SliderOptions);
    private get halfDotW();
    get rect(): DOMRect;
    get mapped(): any;
    get value(): number;
    set value(v: number);
    private dragStartHandler;
    private dragHandler;
    private dragEndHandler;
    private done;
    private updateDom;
    update(v?: number): void;
    mount(el?: string | HTMLElement): void;
    destroy(): void;
}
//# sourceMappingURL=Slider.d.ts.map