import Component from '../../component';
import Events from '../../events';
import RPlayer from '../../rplayer';
import { formatTime } from '../../utils';

class TimeAction extends Component {
  curTime = document.createElement('span');
  totalTime = document.createElement('span');

  constructor(player: RPlayer) {
    super(
      player,
      'div',
      Events.DURATION_CHANGE,
      Events.TIME_UPDATE,
      Events.CONTROLS_SHOW
    );
    this.addClass('rplayer_action_time');

    this.updateCurTime();
    this.updateTotalTime();

    this.appendChild(this.curTime);
    this.appendChild(this.totalTime);
  }

  updateCurTime(): void {
    if (this.player.controls && this.player.controls.isHide) return;
    this.curTime.innerText = formatTime(this.player.currentTime);
  }

  updateTotalTime(time?: number): void {
    this.totalTime.innerText = formatTime(time || this.player.duration);
  }

  onTimeUpdate(): void {
    this.updateCurTime();
  }

  onDurationChange(duration: number): void {
    this.updateTotalTime(duration);
  }

  onControlsShow(): void {
    this.updateCurTime();
  }
}

export default TimeAction;
