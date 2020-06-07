import RPlayer from '../rplayer';
export default class Mask {
    private readonly player;
    readonly dom: HTMLElement;
    constructor(player: RPlayer);
    get isActive(): boolean;
    private clickHandler;
    show(): void;
    hide(): void;
}
//# sourceMappingURL=mask.d.ts.map