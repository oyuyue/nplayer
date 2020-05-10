import Component from '../component';
import RPlayer from '../rplayer';
declare class Bottom extends Component {
    private readonly progressBar;
    private readonly actions;
    private readonly mask;
    constructor(player: RPlayer);
    onBeforeMount(): void;
}
export default Bottom;
