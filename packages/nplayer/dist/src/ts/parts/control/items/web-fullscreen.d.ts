import { Player } from '../../../player';
import { Component } from '../../../utils';
import { Tooltip } from '../../../components/tooltip';
export declare class WebFullscreenControlItem extends Component {
    static readonly id = "web-fullscreen";
    private readonly exitIcon;
    private readonly enterIcon;
    readonly tip: Tooltip;
    constructor(container: HTMLElement, player: Player);
    private enter;
    private exit;
}
