import Component from '../../component';
import RPlayer from '../../rplayer';
export interface TrayOpts {
    text?: string;
    icon?: string | Element;
    pos?: number;
    init?: (tray: Tray, player: RPlayer) => any;
    onClick?: (ev: MouseEvent) => any;
}
export default abstract class Tray extends Component {
    protected readonly tip: HTMLElement;
    pos: number;
    constructor(player?: RPlayer, tipText?: string, ...events: string[]);
    private __onclick;
    abstract onClick(ev?: MouseEvent): any;
    setLeft(): void;
    setRight(): void;
    changeTipText(text: string): void;
}
export declare class ConfigTray extends Tray {
    private readonly clickHandler;
    constructor(opts: TrayOpts, player: RPlayer);
    onClick(ev: MouseEvent): void;
}
