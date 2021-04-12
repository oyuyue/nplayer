import { Component } from '../../utils';
export declare class Mask extends Component {
    constructor(container: HTMLElement, click?: (e: MouseEvent) => void, style?: Partial<CSSStyleDeclaration>);
    show(): void;
    hide(): void;
}
