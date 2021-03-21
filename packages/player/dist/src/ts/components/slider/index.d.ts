import { Component } from '../../utils';
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
    private readonly trackElement;
    private readonly dotElement;
    private readonly rect;
    private readonly step;
    constructor(container: HTMLElement, opts: SliderOption);
    private onDrag;
    update(value: number, x?: number, trigger?: boolean): void;
}
