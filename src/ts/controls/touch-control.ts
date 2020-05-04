import Component from '../component';
import Events from '../events';
import RPlayer from '../rplayer';

class TouchControl extends Component {
  mask: Component;

  showClass = 'rplayer_controls_tc-show';

  constructor(player: RPlayer) {
    super(player, 'div', Events.BEFORE_MOUNT);

    this.addClass('rplayer_controls_tc');

    this.mask = new Component();
    this.mask.addClass('rplayer_controls_tc_mask');
    this.appendChild(this.mask);

    this.mask.dom.addEventListener('touchend', this.onTouchMask);
    document.addEventListener('touchend', this.hide);
  }

  show(): void {
    this.addClass(this.showClass);
  }

  hide = (): void => {
    this.removeClass(this.showClass);
  };

  toggle(): void {
    this.toggleClass(this.showClass);
  }

  onTouchMask = (ev: Event): void => {
    ev.preventDefault();
    ev.stopPropagation();
    this.toggle();
  };

  onBeforeMount(): void {
    this.player.controls.appendChild(this);
  }
}

export default TouchControl;
