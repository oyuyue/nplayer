import Component from '../component';
import RPlayer from '../rplayer';
import ProgressBar from './progress-bar';
declare class Thumbnail extends Component {
    private readonly progressBar;
    private readonly time;
    constructor(player: RPlayer, progressBar: ProgressBar);
    update(x: number, seconds: number): void;
}
export default Thumbnail;
