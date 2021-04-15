import { EVENT } from 'src/ts/constants';
import { Player } from 'src/ts/player';
import {
  $, addDisposable, Component, formatTime,
} from 'src/ts/utils';
import { ControlItem } from '..';

class Time extends Component implements ControlItem {
  private readonly playedElement: HTMLElement;

  private readonly totalElement: HTMLElement;

  constructor(player: Player) {
    super(undefined, '.control_time');
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

const timeControlItem = (player: Player) => new Time(player);
timeControlItem.id = 'time';
export { timeControlItem };
