import { Component } from '../../../../../../../mnt/c/Users/wopen/Projects/rplayer/packages/nplayer/dist/src/ts/utils';
export interface CheckboxOptions {
    html?: string;
    checked?: boolean;
    change?: (newValue: boolean) => void;
}
export declare class Checkbox extends Component {
    constructor(container: HTMLElement, opts: CheckboxOptions);
    update(v: boolean): void;
}
