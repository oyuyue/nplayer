import RPlayer from './rplayer';
declare class Fullscreen {
    private readonly player;
    readonly prefix: string;
    constructor(player: RPlayer);
    private changeHandler;
    private getPrefix;
    get requestFullscreen(): Function;
    get exitFullscreen(): Function;
    get fullscreenElement(): HTMLElement;
    get target(): HTMLElement;
    get isActive(): boolean;
    enter(): void;
    exit(): void;
    toggle(): void;
}
export default Fullscreen;
