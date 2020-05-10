import RPlayer from './rplayer';
declare class Fullscreen {
    private readonly player;
    readonly prefix: string;
    private readonly fullscreenClass;
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
export default Fullscreen;
