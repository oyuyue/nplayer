import RPlayer from 'rplayer';
import { AdsOpts } from './options';
export default class Liner {
    private readonly dom;
    private readonly opts;
    private player;
    private adsItems;
    private remainTime;
    private currentPlayIndex;
    private playlist;
    private videos;
    private videoCurrentTimes;
    private totalPlayTime;
    private tickTimer;
    private tickRemainTimer;
    private prevPlayCurrentTime;
    playing: boolean;
    constructor(opts: AdsOpts);
    install(player: RPlayer): void;
    private disablePlayer;
    private restorePlayer;
    private play;
    private playVideo;
    private checkCanPlay;
    private calcRemainTime;
    private tickRemain;
    private untickRemain;
    private tick;
    private untick;
    private onVideoEnded;
    private pausePlayer;
}
//# sourceMappingURL=liner.d.ts.map