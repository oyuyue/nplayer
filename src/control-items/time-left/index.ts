import { EVENT } from '../../constants';
import { PlayerBase } from '../../player-base';
import { ControlItem } from '../../types';
import {
  addDestroyable, addDestroyableListener, Component, formatTime,
} from '../../utils';

export class TimeLeft extends Component implements ControlItem {
  id = 'time-left';

  private isCurTime = false;

  private isCtrlShow = false;

  onInit(player: PlayerBase) {
    const render = () => {
      this.el.textContent = this.isCurTime
        ? formatTime(player.currentTime)
        : `-${formatTime(player.duration - player.currentTime)}`;
    };

    addDestroyable(this, player.on(EVENT.CONTROL_SHOW, () => this.isCtrlShow = true));
    addDestroyable(this, player.on(EVENT.CONTROL_HIDE, () => this.isCtrlShow = false));
    addDestroyable(this, player.on(EVENT.TIMEUPDATE, () => {
      if (this.isCtrlShow) render();
    }));
    addDestroyableListener(this, this.el, 'click', () => {
      this.isCurTime = !this.isCurTime;
    });
    this.isCtrlShow = player.control.isShowing;
    render();
  }
}
