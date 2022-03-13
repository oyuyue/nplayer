import { CLASS_PLAYER, EVENT } from 'src/ts/constants';
import { Player } from 'src/ts/player';
import {
  addClass, addDisposable, Component, containClass, removeClass, repeatStr,
} from 'src/ts/utils';

const classLoading = '-loading';
export class Loading extends Component {
  private showTimer: any;

  private startWaitingTime = 0;

  constructor(container: HTMLElement, private player: Player) {
    super(container, player.opts.loadingEl || '.loading', undefined, player.opts.loadingEl ? undefined : repeatStr('<i></i>', 12));

    addDisposable(this, player.on(EVENT.CANPLAY, this.hide));
    addDisposable(this, player.on(EVENT.WAITING, () => {
      if (!this.player.currentTime) return;
      this.tryShow();
    }));
    addDisposable(this, player.on(EVENT.STALLED, () => {
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
    }));
  }

  get isActive(): boolean {
    return containClass(this.player.el, classLoading, CLASS_PLAYER);
  }

  private _checkCanplay = (): void => {
    if (this.startWaitingTime !== this.player.currentTime) {
      this.hide();
      clearTimeout(this.showTimer);
      this.player.off(EVENT.TIME_UPDATE, this._checkCanplay);
    }
  };

  private checkCanplay(): void {
    this.startWaitingTime = this.player.currentTime;
    this.player.off(EVENT.TIME_UPDATE, this._checkCanplay);
    this.player.on(EVENT.TIME_UPDATE, this._checkCanplay);
  }

  private tryShow(): void {
    this.checkCanplay();
    clearTimeout(this.showTimer);
    this.showTimer = setTimeout(this.show, 100);
  }

  show = (): void => {
    addClass(this.player.el, classLoading, CLASS_PLAYER);
    this.player.emit(EVENT.LOADING_SHOW);
  }

  hide = () => {
    removeClass(this.player.el, classLoading, CLASS_PLAYER);
    this.player.emit(EVENT.LOADING_HIDE);
  }
}
