import { EVENT } from 'src/ts/constants';
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
    addClass(this.element, 'control_time');
    this.playedElement = this.element.appendChild($('span'));
    this.totalElement = this.element.appendChild($('span'));

    this.played = player.currentTime;
    this.total = player.duration;

    addDisposable(this, player.on(EVENT.TIME_UPDATE, () => {
      this.played = player.currentTime;
    }));
    addDisposable(this, player.on(EVENT.DURATION_CHANGE, () => {
      this.total = player.duration;
    }));
  }

  private set played(v: number) {
    this.playedElement.textContent = formatTime(v);
  }

  private set total(v: number) {
    this.totalElement.textContent = formatTime(v);
  }
}

export const timeControlItem = () => new Time();
