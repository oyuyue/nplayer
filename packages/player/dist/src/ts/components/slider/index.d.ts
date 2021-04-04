import { Player } from '../../player';
import { Component, Rect } from '../../utils';
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
    private readonly step;
    readonly rect: Rect;
    constructor(container: HTMLElement, opts: SliderOption, player?: Player);
    private onDrag;
    update(value: number, x?: number, trigger?: boolean): void;
}
