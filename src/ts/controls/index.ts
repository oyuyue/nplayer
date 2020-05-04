import Component from '../component';
import Events from '../events';
import RPlayer from '../rplayer';
import Bottom from './bottom';
import TouchControl from './touch-control';

class Controls extends Component {
  bottom: Bottom;
  touchControl: TouchControl;
  mask: HTMLElement;

  hideClass = 'rplayer_controls-hide';

  constructor(player: RPlayer) {
    super(player, 'div', Events.BEFORE_MOUNT);

    this.addClass('rplayer_controls');
    this.bottom = new Bottom(player);
    this.touchControl = new TouchControl(player);

    this.mask = document.createElement('div');
    this.mask.classList.add('rplayer_controls_mask');
    this.appendChild(this.mask);
  }

  get isHide(): boolean {
    return this.containsClass(this.hideClass);
  }

  show(): void {
    this.removeClass(this.hideClass);
    this.player.emit(Events.CONTROLS_SHOW);
  }

  hide(): void {
    this.addClass(this.hideClass);
    this.player.emit(Events.CONTROLS_HIDE);
  }

  onBeforeMount(): void {
    this.player.appendChild(this);
  }
}

export default Controls;
