import RPlayer from '../rplayer';
export default class Fullscreen {
    private readonly player;
    readonly prefix: string;
    constructor(player: RPlayer);
    private playerDblClickHandler;
    private changeHandler;
    private getPrefix;
    get requestFullscreen(): Function;
    get exitFullscreen(): Function;
    get fullscreenElement(): HTMLElement;
    get target(): HTMLElement;
    get isActive(): boolean;
    get support(): boolean;
    enter(): void;
    exit(): void;
    toggle(): void;
}
