import { PLAYER_LOADING } from './config/classname';
import EventHandler from './event-handler';
import Events from './events';
import RPlayer from './rplayer';
import { htmlDom } from './utils';

export default class Loading extends EventHandler {
  private readonly loadingClass = 'rplayer-loading';
  private showTimer: NodeJS.Timeout;
  private startWaitingTime = 0;

  constructor(player: RPlayer) {
    super(player, [Events.CANPLAY, Events.WAITING, Events.STALLED]);

    const dom = htmlDom(
      '<div></div><div></div><div></div><div></div>',
      'div',
      PLAYER_LOADING
    );
    player.appendChild(dom);
    this.onWaiting();
  }

  private _checkCanplay = (): void => {
    if (this.startWaitingTime !== this.player.currentTime) {
      this.hide();
      clearTimeout(this.showTimer);
      this.player.off(Events.TIME_UPDATE, this._checkCanplay);
    }
  };

  private checkCanplay(): void {
    this.startWaitingTime = this.player.currentTime;
    this.player.off(Events.TIME_UPDATE, this._checkCanplay);
    this.player.on(Events.TIME_UPDATE, this._checkCanplay);
  }

  private tryShow(): void {
    this.checkCanplay();
    this.showTimer = setTimeout(this.show, 100);
  }

  onCanplay(): void {
    this.hide();
  }

  onWaiting(): void {
    if (!this.player.currentTime) return;
    this.tryShow();
  }

  onStalled(): void {
    const curTime = this.player.currentTime;
    if (!curTime) return;

    let show = true;
    this.player.eachBuffer((start, end) => {
      if (start <= curTime && end > curTime) {
        show = false;
        return true;
      }
    });

    if (show) this.tryShow();
  }

  show = (): void => {
    this.player.addClass(this.loadingClass);
    this.player.emit(Events.LOADING_SHOW);
  };

  hide(): void {
    this.player.removeClass(this.loadingClass);
    this.player.emit(Events.LOADING_HIDE);
  }
}
