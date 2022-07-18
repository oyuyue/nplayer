import { Component } from 'src/ts/utils';
export declare class Switch extends Component {
    constructor(container: HTMLElement, value?: boolean, change?: (v: boolean) => void);
    toggle(value?: boolean): void;
}
