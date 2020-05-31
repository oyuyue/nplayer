import RPlayer from 'rplayer';
import { AdsOpts } from './options';
export default class Ads {
    private player;
    private readonly opts;
    private readonly linerAtItems;
    private readonly linerWaitItems;
    private prevPlayCurrentTime;
    constructor(opts: AdsOpts);
    init(): void;
    install(player: RPlayer): void;
    disablePlayer(): void;
    restorePlayer(): void;
    private pausePlayer;
}
//# sourceMappingURL=ads.d.ts.map