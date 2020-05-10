import Component from '../../component';
import RPlayer from '../../rplayer';
declare class Actions extends Component {
    constructor(player: RPlayer);
    addAction(comp: Component, pos?: number): void;
}
export default Actions;
