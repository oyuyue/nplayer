import Component from '../component';
import Events from '../events';
import RPlayer from '../rplayer';
import { clamp, Drag, newElement } from '../utils';
import Bar from './bar';
import Dot from './dot';
import Thumbnail from './thumbnail';

class ProgressBar extends Component {
  private readonly barWrapper: HTMLElement;
  private readonly bufBar: Bar;
  private readonly playedBar: Bar;
  private readonly padBar: Bar;
  private readonly dot: Dot;
  private readonly thumbnail: Thumbnail;
  private readonly drag: Drag;

  private mouseMovePending = false;
  private mouseMoveLastX = 0;

  constructor(player: RPlayer) {
    super({
      player,
      events: [Events.TIME_UPDATE, Events.PROGRESS, Events.CONTROLS_SHOW],
      autoUpdateRect: true,
    });

    this.addClass('rplayer_progress');

    this.barWrapper = newElement();
    this.barWrapper.classList.add('rplayer_progress_bar_wrapper');

    this.bufBar = new Bar('rplayer_progress_buf');
    this.playedBar = new Bar('rplayer_progress_played');
    this.padBar = new Bar('rplayer_progress_pad');
    this.dot = new Dot('rplayer_progress_dot');
    this.thumbnail = new Thumbnail(player, this);

    this.drag = new Drag(
      this.padBar.dom,
      this.dragStartHandler,
      this.dragHandler,
      this.dragEndHandler
    );

    this.padBar.dom.addEventListener('mousemove', this.mouseMoveHandler, true);

    this.barWrapper.appendChild(this.bufBar.dom);
    this.barWrapper.appendChild(this.playedBar.dom);
    this.barWrapper.appendChild(this.padBar.dom);
    this.appendChild(this.barWrapper);
    this.appendChild(this.dot);
    this.appendChild(this.thumbnail);
  }

  private calcCurrentTime(x: number): number {
    return ((x - this.rect.x) / this.rect.width) * this.player.duration;
  }

  private dragStartHandler = (): void => {
    this.player.pause();
  };

  private dragHandler = (ev: PointerEvent): void => {
    const x = ev.pageX - this.rect.x;
    this.dot.setX(clamp(x, 0, this.rect.width));
    this.playedBar.setX(x / this.rect.width);
    this.mouseMoveLastX = ev.pageX;
    this.updateThumbnail();
  };

  private dragEndHandler = (ev: PointerEvent): void => {
    this.player.seek(this.calcCurrentTime(ev.pageX));
    this.player.play();
  };

  private mouseMoveHandler = (ev: MouseEvent): void => {
    ev.preventDefault();
    this.mouseMoveLastX = ev.pageX;
    if (this.mouseMovePending) return;
    this.mouseMovePending = true;
    requestAnimationFrame(this.updateThumbnail);
  };

  /**
   * @override
   */
  updateRect = (): void => {
    this._rect = this.dom.getBoundingClientRect();
    this.updatePlayedBar();
  };

  updatePlayedBar(): void {
    if (this.player.controls.isHide) return;
    const percentage = this.player.currentTime / this.player.duration;
    this.dot.setX(this.rect.width * percentage);
    this.playedBar.setX(percentage);
  }

  updateBufBar(): void {
    if (this.player.controls.isHide) return;
    const bufLen = this.player.buffered.length;

    if (!bufLen) return this.bufBar.setX(0);

    const curTime = this.player.currentTime;
    let percentage = 0;

    for (let i = bufLen - 1; i >= 0; i--) {
      const endBuf = this.player.buffered.end(i);

      if (this.player.buffered.start(i) <= curTime && endBuf >= curTime) {
        percentage = endBuf / this.player.duration;
        break;
      }
    }

    this.bufBar.setX(percentage);
  }

  updateThumbnail = (): void => {
    this.thumbnail.update(
      this.mouseMoveLastX - this.rect.x,
      this.calcCurrentTime(this.mouseMoveLastX)
    );
    this.mouseMovePending = false;
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

  destroy(): void {
    this.drag.destroy();
  }
}

export default ProgressBar;
