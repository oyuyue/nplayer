import Component from '../../component';
import RPlayer from '../../rplayer';
declare class TimeAction extends Component {
    private readonly curTime;
    private readonly totalTime;
    constructor(player: RPlayer);
    private updateCurTime;
    private updateTotalTime;
    onTimeUpdate(): void;
    onDurationChange(): void;
    onControlsShow(): void;
}
export default TimeAction;
