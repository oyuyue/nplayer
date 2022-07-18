import { Component } from 'src/ts/utils';
export interface CheckboxOptions {
    html?: string;
    checked?: boolean;
    change?: (newValue: boolean) => void;
}
export declare class Checkbox extends Component {
    constructor(container: HTMLElement, opts: CheckboxOptions);
    update(v: boolean): void;
}
