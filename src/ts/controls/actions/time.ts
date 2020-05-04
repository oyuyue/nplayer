import Component from '../../component';
import Events from '../../events';
import RPlayer from '../../rplayer';
import { formatTime } from '../../utils';

class TimeAction extends Component {
  curTime = document.createElement('span');
  totalTime = document.createElement('span');

  constructor(player: RPlayer) {
    super(player, 'div', Events.DURATION_CHANGE, Events.TIME_UPDATE);
    this.addClass('rplayer_action_time');

    this.updateCurTime();
    this.updateTotalTime();

    this.appendChild(this.curTime);
    this.appendChild(this.totalTime);
  }

  onTimeUpdate(): void {
    this.updateCurTime();
  }

  onDurationChange(duration: number): void {
    this.updateTotalTime(duration);
  }

  updateCurTime(time?: number): void {
    this.curTime.innerHTML = formatTime(time || this.player.currentTime);
  }

  updateTotalTime(time?: number): void {
    this.totalTime.innerHTML = formatTime(time || this.player.duration);
  }
}

export default TimeAction;
