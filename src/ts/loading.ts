import EventHandler from './event-handler';
import Events from './events';
import RPlayer from './rplayer';
import { htmlDom } from './utils';

class Loading extends EventHandler {
  private readonly loadingClass = 'rplayer-loading';
  private startWaitingTime = 0;

  constructor(player: RPlayer) {
    super(player, [Events.CANPLAY, Events.WAITING, Events.STALLED]);

    const dom = htmlDom('<div></div><div></div><div></div><div></div>', 'div');
    dom.classList.add('rplayer_loading');
    player.appendChild(dom);
    this.onWaiting();
  }

  private _checkCanplay = (): void => {
    if (this.startWaitingTime !== this.player.currentTime) {
      this.hide();
      this.player.off(Events.TIME_UPDATE, this._checkCanplay);
    }
  };

  private checkCanplay(): void {
    this.startWaitingTime = this.player.currentTime;
    this.player.off(Events.TIME_UPDATE, this._checkCanplay);
    this.player.on(Events.TIME_UPDATE, this._checkCanplay);
  }

  onCanplay(): void {
    this.hide();
  }

  onWaiting(): void {
    this.show();
    this.checkCanplay();
  }

  onStalled(): void {
    this.show();
    this.checkCanplay();
  }

  show(): void {
    this.player.addClass(this.loadingClass);
  }

  hide(): void {
    this.player.removeClass(this.loadingClass);
  }
}

export default Loading;
