import Ads from '.';
import RPlayer from 'rplayer';
export default class NonLiner {
    private readonly ads;
    readonly dom: HTMLElement;
    private readonly closeDom;
    private adsItems;
    private currentAd;
    constructor(ads: Ads);
    show(): void;
    hide: () => void;
    private onPlayerPause;
    private onDomClick;
    private onClose;
    install(player: RPlayer): void;
}
//# sourceMappingURL=non-liner.d.ts.map