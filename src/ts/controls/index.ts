import Component from '../component';
import Events from '../events';
import RPlayer from '../rplayer';
import Bottom from './bottom';
import ContextMenu from './contextmenu';
import Mask from './mask';

class Controls extends Component {
  private controlsTimer: NodeJS.Timeout;

  readonly bottom: Bottom;
  readonly mask: Mask;
  readonly contextMenu: ContextMenu;

  private readonly hideClass = 'rplayer_controls-hide';
  private readonly pausedClass = 'rplayer-paused';

  private showLatch = 0;

  constructor(player: RPlayer) {
    super(player, {
      events: [
        Events.PLAY,
        Events.PAUSE,
        Events.PLAYER_MOUSE_MOVE,
        Events.PLAYER_MOUSE_LEAVE,
        Events.PLAYER_CLICK,
      ],
    });

    this.addClass('rplayer_controls');
    if (player.paused) player.addClass(this.pausedClass);

    this.bottom = new Bottom(player);
    this.mask = new Mask(player);
    this.contextMenu = new ContextMenu(player);

    this.appendChild(this.bottom.mask);
    this.appendChild(this.bottom);
    this.appendChild(this.contextMenu);
    this.appendChild(this.mask.dom);
  }

  get isHide(): boolean {
    return this.containsClass(this.hideClass);
  }

  private tryHideControls = (ev?: MouseEvent): void => {
    if (ev) ev.preventDefault();
    const media = this.player.media;

    if (media.played.length && !media.paused && !this.showLatch) {
      this.hide();
    }
  };

  requireShow(): void {
    this.showLatch++;
  }

  releaseShow(): void {
    this.showLatch--;
    if (this.showLatch < 0) this.showLatch = 0;
  }

  showTemporary(): void {
    this.show();
    clearTimeout(this.controlsTimer);
    this.controlsTimer = setTimeout(this.tryHideControls, 3000);
  }

  show(): void {
    if (!this.isHide) return;
    this.removeClass(this.hideClass);
    this.player.emit(Events.CONTROLS_SHOW);
  }

  hide(): void {
    if (this.isHide) return;
    this.addClass(this.hideClass);
    this.player.emit(Events.CONTROLS_HIDE);
  }

  onPlay(): void {
    this.showTemporary();
    this.player.removeClass(this.pausedClass);
  }

  onPause(): void {
    this.show();
    this.player.addClass(this.pausedClass);
  }

  onPlayerClick(ev: Event): void {
    ev.preventDefault();
    if (!this.bottom.dom.contains(ev.target as any)) {
      this.player.toggle();
    }
    this.showTemporary();
  }

  onPlayerMouseMove(): void {
    this.showTemporary();
  }

  onPlayerMouseLeave(): void {
    this.tryHideControls();
  }
}

export default Controls;
