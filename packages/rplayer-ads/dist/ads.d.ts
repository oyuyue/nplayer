import RPlayer from 'rplayer';
import { AdsOpts } from './options';
import Liner from './liner';
import NonLiner from './non-liner';
export default class Ads extends RPlayer.EventEmitter {
    static readonly Events: {
        LINER_AD_PLAY: string;
        LINER_AD_END: string;
    };
    private readonly dom;
    readonly liner: Liner;
    readonly nonLiner: NonLiner;
    readonly opts: AdsOpts;
    constructor(opts: AdsOpts);
    install(player: RPlayer): void;
}
//# sourceMappingURL=ads.d.ts.map