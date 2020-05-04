import Component from '../component';
import Events from '../events';
import RPlayer from '../rplayer';
import { clamp, Drag } from '../utils';
import Bar from './bar';
import Dot from './dot';
import Thumbnail from './thumbnail';

class ProgressBar extends Component {
  barWrapper: Component;
  bufBar: Bar;
  playedBar: Bar;
  padBar: Bar;
  dot: Dot;
  thumbnail: Thumbnail;

  drag: Drag;

  mouseMovePending = false;
  mouseMoveLastX = 0;

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
    this.thumbnail = new Thumbnail(player, this);

    this.drag = new Drag(
      this.padBar.dom,
      this.onDrag,
      this.onDrag,
      this.onDragEnd
    );

    this.padBar.dom.addEventListener('mousemove', this.onMouseMove, true);
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

  updateThumbnail = (): void => {
    this.thumbnail.update(
      this.mouseMoveLastX - this.rect.x,
      this.calcCurrentTime(this.mouseMoveLastX)
    );
    this.mouseMovePending = false;
  };

  calcCurrentTime(x: number): number {
    return ((x - this.rect.x) / this.rect.width) * this.player.duration;
  }

  onDrag = (ev: PointerEvent): void => {
    const x = ev.pageX - this.rect.x;
    this.dot.setX(clamp(x, 0, this.rect.width));
    this.playedBar.set(x / this.rect.width);
    this.mouseMoveLastX = ev.pageX;
    this.updateThumbnail();
  };

  onDragEnd = (ev: PointerEvent): void => {
    this.player.seek(this.calcCurrentTime(ev.pageX));
  };

  onMouseMove = (ev: MouseEvent): void => {
    ev.preventDefault();
    this.mouseMoveLastX = ev.pageX;
    if (this.mouseMovePending) return;
    this.mouseMovePending = true;
    requestAnimationFrame(this.updateThumbnail);
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
    this.appendChild(this.thumbnail);
    this.player.controls.bottom.appendChild(this);
  }
}

export default ProgressBar;
