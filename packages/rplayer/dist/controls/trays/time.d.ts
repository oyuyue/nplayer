import Component from '../../component';
import RPlayer from '../../rplayer';
export default class Time extends Component {
    private readonly curTime;
    private readonly totalTime;
    readonly pos = 2;
    constructor(player: RPlayer);
    private updateCurTime;
    private updateTotalTime;
    onTimeUpdate(): void;
    onDurationChange(): void;
    onControlsShow(): void;
}
//# sourceMappingURL=time.d.ts.map