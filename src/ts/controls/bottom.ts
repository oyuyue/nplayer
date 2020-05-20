import Component from '../component';
import RPlayer from '../rplayer';
import { newElement } from '../utils';
import Actions from './actions';
import ProgressBar from './progress-bar';

class Bottom extends Component {
  readonly progressBar: ProgressBar;
  readonly actions: Actions;
  readonly mask: HTMLElement;

  constructor(player: RPlayer) {
    super(player);

    this.addClass('rplayer_ctrl_bottom');

    this.progressBar = new ProgressBar(player);
    this.actions = new Actions(player);
    this.mask = newElement();
    this.mask.classList.add('rplayer_ctrl_bottom_mask');

    this.appendChild(this.progressBar);
    this.appendChild(this.actions);
  }
}

export default Bottom;
