import { Player } from 'src/ts/player';
import { Disposable } from 'src/ts/types';
import { Tooltip } from 'src/ts/components/tooltip';
import { Component } from 'src/ts/utils';
import { ControlBar } from './items';
export interface ControlItem extends Partial<Disposable> {
    el: HTMLElement;
    id?: any;
    tip?: string;
    tooltip?: Tooltip;
    mounted?: boolean;
    init?: (player: Player, position: number, tooltip: Tooltip) => void;
    update?: (position: number) => void;
    hide?: () => void;
    isSupport?: (player: Player) => boolean;
    [key: string]: any;
}
export declare class Control extends Component {
    private player;
    private readonly bgElement;
    private showTimer;
    private delayHidTime;
    private latch;
    private controlBars;
    private controls;
    currentBp: number | undefined;
    constructor(container: HTMLElement, player: Player);
    get isActive(): boolean;
    private filterItems;
    private emitAndUpdateBp;
    updateItems(items: Parameters<ControlBar['update']>[0], index?: number): void;
    require(): void;
    release(): void;
    show: () => void;
    hide: () => void;
    showTransient: () => void;
    tryHide: () => void;
}
