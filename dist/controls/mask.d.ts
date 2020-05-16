import RPlayer from '../rplayer';
declare class Mask {
    private readonly player;
    readonly dom: HTMLElement;
    constructor(player: RPlayer);
    get isActive(): boolean;
    private clickHandler;
    show(): void;
    hide(): void;
}
export default Mask;
