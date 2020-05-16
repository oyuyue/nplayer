import Component from '../component';
import RPlayer from '../rplayer';
declare class Bottom extends Component {
    private readonly progressBar;
    private readonly actions;
    readonly mask: HTMLElement;
    constructor(player: RPlayer);
}
export default Bottom;
