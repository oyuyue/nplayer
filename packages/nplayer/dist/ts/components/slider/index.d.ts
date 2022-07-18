import { Component, Rect } from 'src/ts/utils';
export interface SliderOption {
    value?: number;
    stops?: {
        value: number;
        html?: string;
    }[];
    change?: (value: number) => void;
    step?: boolean;
}
export declare class Slider extends Component {
    private opts;
    private readonly trackEl;
    private readonly dotEl;
    private readonly step;
    readonly rect: Rect;
    constructor(container: HTMLElement, opts: SliderOption);
    private onDrag;
    update(value: number, x?: number, trigger?: boolean): void;
}
