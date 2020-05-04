import Component from '../component';
import Events from '../events';
import RPlayer from '../rplayer';
import { newElement } from '../utils';
import Bottom from './bottom';

class Controls extends Component {
  private controlsTimer: NodeJS.Timeout;

  readonly bottom: Bottom;
  private readonly mask: HTMLElement;

  private readonly hideClass = 'rplayer_controls-hide';

  constructor(player: RPlayer) {
    super({ player, events: [Events.PLAY, Events.PAUSE] });

    this.addClass('rplayer_controls');

    this.mask = newElement();
    this.mask.classList.add('rplayer_controls_mask');
    this.bottom = new Bottom(player);

    this.appendChild(this.mask);
    this.appendChild(this.bottom);

    this.initEvents();
  }

  get isHide(): boolean {
    return this.containsClass(this.hideClass);
  }

  private initEvents(): void {
    const container = this.player.dom;

    container.addEventListener('mousemove', this.delayHide);
    container.addEventListener('mouseleave', this.tryHideControls);
    container.addEventListener('click', this.delayHide);
  }

  private delayHide = (ev?: Event): void => {
    if (ev) ev.preventDefault();
    this.show();
    clearTimeout(this.controlsTimer);
    this.controlsTimer = setTimeout(this.tryHideControls, 3000);
  };

  private tryHideControls = (ev?: MouseEvent): void => {
    if (ev) ev.preventDefault();
    const media = this.player.media;

    if (media.played.length && !media.paused) {
      this.hide();
    }
  };

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
    this.delayHide();
  }

  onPause(): void {
    this.show();
  }
}

export default Controls;
