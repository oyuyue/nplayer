import Component from '../component';
import Events from '../events';
import RPlayer from '../rplayer';

class Bottom extends Component {
  private controlsTimer: NodeJS.Timeout;

  constructor(player: RPlayer) {
    super(player, 'div', Events.BEFORE_MOUNT);

    this.addEvents();
    this.addClass('rplayer_controls_bottom');
  }

  private addEvents(): void {
    const container = this.player.dom;
    const media = this.player.media;

    container.addEventListener('mousemove', this.delayHide);
    container.addEventListener('mouseleave', this.tryHideControls);
    container.addEventListener('click', this.delayHide);
    media.addEventListener('play', this.delayHide);
    media.addEventListener('pause', this.showControls);
  }

  private delayHide = (ev: Event): void => {
    ev.preventDefault();
    this.showControls();
    clearTimeout(this.controlsTimer);
    this.controlsTimer = setTimeout(this.tryHideControls, 3000);
  };

  showControls = (): void => {
    this.player.controls.show();
  };

  hideControls(): void {
    this.player.controls.hide();
  }

  tryHideControls = (): void => {
    const media = this.player.media;
    if (media.played.length && !media.paused) {
      this.hideControls();
    }
  };

  onBeforeMount(): void {
    this.player.controls.appendChild(this);
  }
}

export default Bottom;
