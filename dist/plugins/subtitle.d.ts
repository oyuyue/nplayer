import RPlayer from '../rplayer';
export interface SubtitleOpts {
    style?: Partial<CSSStyleDeclaration>;
    checked?: number;
    captions: HTMLTrackElement[];
}
export default class Subtitle {
    private readonly player;
    private tray;
    private items;
    private prev;
    private select;
    private readonly dom;
    constructor(player: RPlayer);
    private optionChangeHandler;
    private cueChangeHandler;
    private addCueEvent;
    private removeCueEvent;
    private run;
    renderText(text: string): void;
    show(): void;
    hide(): void;
    update(tracks: Partial<HTMLTrackElement>[], checked?: number): void;
    updateUI(style: SubtitleOpts['style']): void;
    toggle(): void;
}
