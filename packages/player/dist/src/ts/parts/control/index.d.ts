import { Player } from '../../player';
import { Disposable } from '../../types';
import { Tooltip } from '../../components/tooltip';
import { Component } from '../../utils';
export declare type ControlItem = (new (container: HTMLElement, player: Player) => Partial<Disposable> & {
    tip?: Tooltip;
}) & {
    id?: string;
    isSupport?: () => boolean;
};
export declare class Control extends Component {
    private player;
    private readonly bgElement;
    private showTimer;
    private delayHidTime;
    private latch;
    constructor(container: HTMLElement, player: Player);
    get showing(): boolean;
    require(): void;
    release(): void;
    show: () => void;
    hide: () => void;
    showTransient: () => void;
    tryHide: () => void;
}
