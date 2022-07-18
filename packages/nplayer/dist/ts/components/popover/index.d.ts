import { Component } from 'src/ts/utils';
export declare class Popover extends Component {
    private readonly onHide?;
    readonly panelEl: HTMLElement;
    readonly maskEl: HTMLElement;
    constructor(container: HTMLElement, onHide?: ((ev?: MouseEvent | undefined) => void) | undefined, style?: Partial<CSSStyleDeclaration>, left?: boolean);
    resetPos(): void;
    setBottom(): void;
    applyPanelStyle(style: Partial<CSSStyleDeclaration>): void;
    show(): void;
    hide(ev?: MouseEvent): void;
}
