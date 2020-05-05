import Component from '../component';
import Events from '../events';
import RPlayer from '../rplayer';
import { newElement } from '../utils';
import Actions from './actions';
import ProgressBar from './progress-bar';

class Bottom extends Component {
  private readonly progressBar: ProgressBar;
  private readonly actions: Component;
  private readonly mask: HTMLElement;

  constructor(player: RPlayer) {
    super(player, { events: [Events.BEFORE_MOUNT] });

    this.addClass('rplayer_controls_bottom');

    this.progressBar = new ProgressBar(player);
    this.actions = new Actions(player);
    this.mask = newElement();
    this.mask.classList.add('rplayer_controls_bottom_mask');

    this.appendChild(this.progressBar);
    this.appendChild(this.actions);
  }

  onBeforeMount(): void {
    this.player.controls.appendChild(this.mask);
  }
}

export default Bottom;
