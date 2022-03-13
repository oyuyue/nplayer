import type { PlayerBase } from '../../player-base';
import { CLASS_PLAYER, EVENT } from '../../constants';
import {
  $,
  addClass, addDestroyable, Component, containClass, removeClass,
} from '../../utils';
import './index.scss';

const classLoading = '-loading';

function getLoadingEl() {
  return $();
}

export class Loading extends Component {
  private showTimer: any;

  constructor(container: HTMLElement, private player: PlayerBase) {
    super(container, '.loading');

    const { el, disabled } = player.config.loading;
    if (disabled) return;
    this.el.appendChild(el || getLoadingEl());
    addDestroyable(this, player.on(EVENT.CANPLAY, this.hide));
    addDestroyable(this, player.on(EVENT.WAITING, this.onWait));
    addDestroyable(this, player.on(EVENT.STALLED, this.onWait));
  }

  get isActive() {
    return containClass(this.player.el, classLoading, CLASS_PLAYER);
  }

  show = () => {
    addClass(this.player.el, classLoading, CLASS_PLAYER);
    this.player.emit(EVENT.LOADING_SHOW, this.player);
  }

  hide = () => {
    removeClass(this.player.el, classLoading, CLASS_PLAYER);
    this.player.emit(EVENT.LOADING_HIDE, this.player);
  }

  private onTimeupdate = () => {
    this.hide();
    clearTimeout(this.showTimer);
    this.player.off(EVENT.TIMEUPDATE, this.onTimeupdate);
  };

  private checkCanplay() {
    this.player.off(EVENT.TIMEUPDATE, this.onTimeupdate);
    this.player.on(EVENT.TIMEUPDATE, this.onTimeupdate);
  }

  private onWait = () => {
    const curTime = this.player.currentTime;
    if (!curTime) return;
    this.checkCanplay();
    clearTimeout(this.showTimer);
    this.showTimer = setTimeout(this.show, 200);
  }
}
