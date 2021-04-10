import { Component } from '../../utils';
export declare class Popover extends Component {
    private readonly onHide?;
    readonly panelElement: HTMLElement;
    readonly maskElement: HTMLElement;
    constructor(container: HTMLElement, onHide?: ((ev?: MouseEvent | undefined) => void) | undefined, style?: Partial<CSSStyleDeclaration>, left?: boolean);
    applyPanelStyle(style: Partial<CSSStyleDeclaration>): void;
    show(): void;
    hide(ev?: MouseEvent): void;
}
