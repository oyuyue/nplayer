import Component from '../../component';
import RPlayer from '../../rplayer';
declare class VolumeAction extends Component {
    private readonly icon;
    private readonly progress;
    constructor(player: RPlayer);
    onVolumeChange(): void;
    onMounted(): void;
}
export default VolumeAction;
