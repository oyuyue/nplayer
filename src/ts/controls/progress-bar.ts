import Component from '../component';
import Events from '../events';
import RPlayer from '../rplayer';
import { clamp, Drag } from '../utils';
import Bar from './bar';
import Dot from './dot';

class ProgressBar extends Component {
  barWrapper: Component;
  bufBar: Bar;
  playedBar: Bar;
  padBar: Bar;
  dot: Dot;

  drag: Drag;

  constructor(player: RPlayer) {
    super(
      player,
      'div',
      Events.BEFORE_MOUNT,
      Events.TIME_UPDATE,
      Events.PROGRESS,
      Events.CONTROLS_SHOW
    );

    this.addClass('rplayer_progress');

    this.barWrapper = new Component();
    this.barWrapper.addClass('rplayer_progress_bar_wrapper');
    this.bufBar = new Bar('rplayer_progress_bar rplayer_progress_buf');
    this.playedBar = new Bar('rplayer_progress_bar rplayer_progress_played');
    this.padBar = new Bar('rplayer_progress_bar rplayer_progress_pad');
    this.dot = new Dot('rplayer_progress_dot');

    this.drag = new Drag(
      this.padBar.dom,
      this.onDrag,
      this.onDrag,
      this.onDragEnd
    );
  }

  updatePlayedBar(): void {
    if (this.player.controls.isHide) return;
    const percentage = this.player.currentTime / this.player.duration;
    this.dot.setX(this.rect.width * percentage);
    this.playedBar.set(percentage);
  }

  updateBufBar(): void {
    if (this.player.controls.isHide) return;
    const bufLen = this.player.buffered.length;
    const percentage = bufLen
      ? this.player.buffered.end(bufLen - 1) / this.player.duration
      : 0;
    this.bufBar.set(percentage);
  }

  onDrag = (ev: PointerEvent): void => {
    const x = ev.pageX - this.rect.x;
    this.dot.setX(clamp(x, 0, this.rect.width));
    this.playedBar.set(x / this.rect.width);
  };

  onDragEnd = (ev: PointerEvent): void => {
    this.player.seek(
      ((ev.pageX - this.rect.x) / this.rect.width) * this.player.duration
    );
  };

  onControlsShow(): void {
    this.updatePlayedBar();
    this.updateBufBar();
  }

  onTimeUpdate(): void {
    this.updatePlayedBar();
  }

  onProgress(): void {
    this.updateBufBar();
  }

  onBeforeMount(): void {
    this.barWrapper.appendChild(this.bufBar);
    this.barWrapper.appendChild(this.playedBar);
    this.barWrapper.appendChild(this.padBar);
    this.appendChild(this.barWrapper);
    this.appendChild(this.dot);
    this.player.controls.bottom.appendChild(this);
  }
}

export default ProgressBar;
