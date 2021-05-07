import { EVENT } from 'src/ts/constants';
import { I18n, LIVE } from 'src/ts/features';
import { Player } from 'src/ts/player';
import {
  $, addClass, addDisposable, Component, formatTime,
} from 'src/ts/utils';
import { ControlItem } from '..';

class Time extends Component implements ControlItem {
  readonly id = 'time';

  private playedElement!: HTMLElement;

  private totalElement!: HTMLElement;

  init(player: Player) {
    addClass(this.el, 'control_time');

    if (player.opts.live) {
      addClass(this.el, 'control_time-live');
      this.el.textContent = I18n.t(LIVE);
    } else {
      this.playedElement = this.el.appendChild($('span'));
      this.totalElement = this.el.appendChild($('span'));

      this.played = player.currentTime;
      this.total = player.duration;

      addDisposable(this, player.on(EVENT.TIME_UPDATE, () => {
        this.played = player.currentTime;
      }));
      addDisposable(this, player.on(EVENT.DURATION_CHANGE, () => {
        this.total = player.duration;
      }));
    }
  }

  private set played(v: number) {
    this.playedElement.textContent = formatTime(v);
  }

  private set total(v: number) {
    this.totalElement.textContent = formatTime(v);
  }
}

export const timeControlItem = () => new Time();
