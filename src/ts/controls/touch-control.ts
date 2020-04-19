import Component from '../component';
import Events from '../events';
import RPlayer from '../rplayer';

class TouchControl extends Component {
  private mask: Component;
  private classNameShow = 'rplayer_controls_tc-show';

  constructor(player: RPlayer) {
    super(player, 'div', Events.BEFORE_MOUNT);

    this.addClass('rplayer_controls_tc');

    this.mask = new Component();
    this.mask.addClass('rplayer_controls_tc_mask');
    this.appendChild(this.mask);

    this.mask.dom.addEventListener('touchend', this.onTouchMask);
    this.mask.dom.addEventListener('click', this.onClickMask);
    document.addEventListener('touchend', this.hide);
  }

  show(): void {
    this.addClass(this.classNameShow);
  }

  hide = (): void => {
    this.removeClass(this.classNameShow);
  };

  toggle(): void {
    this.toggleClass(this.classNameShow);
  }

  onTouchMask = (ev: Event): void => {
    ev.preventDefault();
    ev.stopPropagation();
    this.toggle();
  };

  onClickMask = (ev: Event): void => {
    ev.preventDefault();
    this.player.toggle();
  };

  onBeforeMount(): void {
    this.player.controls.appendChild(this);
  }
}

export default TouchControl;
