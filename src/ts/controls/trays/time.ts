import Component from '../../component';
import { TRAY_TIME } from '../../config/classname';
import Events from '../../events';
import RPlayer from '../../rplayer';
import { formatTime, newElement } from '../../utils';

export default class Time extends Component {
  private readonly curTime = newElement('', 'span');
  private readonly totalTime = newElement('', 'span');
  pos = 2;

  constructor(player: RPlayer) {
    super(player, {
      events: [
        Events.DURATION_CHANGE,
        Events.TIME_UPDATE,
        Events.CONTROLS_SHOW,
      ],
      className: TRAY_TIME,
    });

    this.updateCurTime();
    this.updateTotalTime();
    this.appendChild(this.curTime);
    this.appendChild(this.totalTime);
  }

  private updateCurTime(): void {
    if (this.player.controls && this.player.controls.isHide) return;
    this.curTime.innerText = formatTime(this.player.currentTime);
  }

  private updateTotalTime(): void {
    this.totalTime.innerText = formatTime(this.player.duration);
  }

  onTimeUpdate(): void {
    this.updateCurTime();
  }

  onDurationChange(): void {
    this.updateTotalTime();
  }

  onControlsShow(): void {
    this.updateCurTime();
  }
}
