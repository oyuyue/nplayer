import RPlayer from '../rplayer';
export default class Fullscreen {
    private readonly tray;
    private readonly player;
    readonly prefix: string;
    private target;
    constructor(player: RPlayer);
    private playerDblClickHandler;
    private changeHandler;
    private getPrefix;
    get requestFullscreen(): Function;
    get exitFullscreen(): Function;
    get fullscreenElement(): HTMLElement;
    get isActive(): boolean;
    private onClick;
    private onEnterFullscreen;
    private onExitFullscreen;
    setTarget(dom?: HTMLElement, video?: HTMLVideoElement): void;
    enter(): void;
    exit(): void;
    toggle(): void;
}
//# sourceMappingURL=fullscreen.d.ts.map