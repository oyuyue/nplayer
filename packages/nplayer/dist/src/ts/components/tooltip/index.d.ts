import { Component } from '../../utils';
export declare class Tooltip extends Component {
    constructor(container: HTMLElement, html?: string);
    get html(): string;
    set html(v: string);
    setLeft(): void;
    setRight(): void;
    hide(): void;
    show(): void;
}
