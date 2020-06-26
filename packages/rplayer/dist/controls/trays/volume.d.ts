import Component from '../../component';
import RPlayer from '../../rplayer';
export default class VolumeTray extends Component {
    private readonly tray;
    private readonly progress;
    readonly pos = 1;
    constructor(player: RPlayer);
    onClick: () => void;
    onVolumeChange(): void;
    onMounted(): void;
}
//# sourceMappingURL=volume.d.ts.map