import { Component } from 'src/ts/utils';
export declare class Tooltip extends Component {
    constructor(container: HTMLElement, html?: string);
    get html(): string;
    set html(v: string);
    resetPos(): void;
    setBottom(): void;
    setLeft(): void;
    setRight(): void;
    hide(): void;
    show(): void;
}
