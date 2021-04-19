import { Player } from '../../player';
import { Disposable } from '../../types';
import { Tooltip } from '../../components/tooltip';
import { Component } from '../../utils';
export interface ControlItem extends Partial<Disposable> {
    element: HTMLElement;
    id?: string;
    tip?: string;
    tooltip?: Tooltip;
    init?: (player: Player, tooltip: Tooltip) => void;
    isSupport?: (player: Player) => boolean;
    [key: string]: any;
}
export declare class Control extends Component {
    private player;
    private readonly bgElement;
    private showTimer;
    private delayHidTime;
    private latch;
    constructor(container: HTMLElement, player: Player);
    get isActive(): boolean;
    require(): void;
    release(): void;
    show: () => void;
    hide: () => void;
    showTransient: () => void;
    tryHide: () => void;
}
