import Component from '../component';
import Events from '../events';
import RPlayer from '../rplayer';
import Bottom from './bottom';
import TouchControl from './touch-control';

class Controls extends Component {
  public bottom: Bottom;
  public touchControl: TouchControl;

  constructor(player: RPlayer) {
    super(player, 'div', Events.BEFORE_MOUNT);

    this.addClass('rplayer_controls');
    this.bottom = new Bottom(player);
    this.touchControl = new TouchControl(player);
  }

  show(): void {
    this.removeClass('rplayer_controls-hide');
  }

  hide(): void {
    this.addClass('rplayer_controls-hide');
  }

  onBeforeMount(): void {
    this.player.appendChild(this);
  }
}

export default Controls;
