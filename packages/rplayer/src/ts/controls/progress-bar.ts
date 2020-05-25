import Component from '../component';
import {
  PROGRESS,
  PROGRESS_BUF,
  PROGRESS_DOT,
  PROGRESS_HOVER,
  PROGRESS_PAD,
  PROGRESS_PLAYED,
  PROGRESS_WRAPPER,
} from '../config/classname';
import Events from '../events';
import RPlayer from '../rplayer';
import { clamp, Drag, newElement } from '../utils';
import Bar from './bar';
import Dot from './dot';
import Thumbnail from './thumbnail';

export default class ProgressBar extends Component {
  private readonly barWrapper: HTMLElement;
  private readonly bufBar: Bar;
  private readonly hoverBar: Bar;
  private readonly playedBar: Bar;
  private readonly dot: Dot;
  private readonly thumbnail: Thumbnail;
  private readonly drag: Drag;

  private mouseMovePending = false;
  private mouseMoveLastX = 0;
  private dragging = false;

  constructor(player: RPlayer) {
    super(player, {
      events: [Events.TIME_UPDATE, Events.PROGRESS, Events.CONTROLS_SHOW],
      autoUpdateRect: true,
      className: PROGRESS,
    });

    this.barWrapper = newElement(PROGRESS_WRAPPER);

    const padBar = new Bar(PROGRESS_PAD);
    this.bufBar = new Bar(PROGRESS_BUF);
    this.hoverBar = new Bar(PROGRESS_HOVER);
    this.playedBar = new Bar(PROGRESS_PLAYED);
    this.dot = new Dot(PROGRESS_DOT);
    this.thumbnail = new Thumbnail(player, this);

    this.drag = new Drag(
      padBar.dom,
      this.dragStartHandler,
      this.dragHandler,
      this.dragEndHandler
    );

    padBar.dom.addEventListener('mousemove', this.mouseMoveHandler, true);

    this.barWrapper.appendChild(this.bufBar.dom);
    this.barWrapper.appendChild(this.hoverBar.dom);
    this.barWrapper.appendChild(this.playedBar.dom);
    this.barWrapper.appendChild(padBar.dom);
    this.appendChild(this.barWrapper);
    this.appendChild(this.dot.dom);
    this.appendChild(this.thumbnail);
  }

  private calcCurrentTime(x: number): number {
    return ((x - this.rect.left) / this.rect.width) * this.player.duration;
  }

  private dragStartHandler = (ev: PointerEvent): void => {
    this.player.pause();
    this.dragging = true;
    this.dragHandler(ev);
  };

  private dragHandler = (ev: PointerEvent): void => {
    const x = ev.pageX - this.rect.left;
    this.dot.setX(clamp(x, 0, this.rect.width));
    this.playedBar.setX(x / this.rect.width);
    this.mouseMoveLastX = ev.pageX;
    this.updateThumbnail(x);
  };

  private dragEndHandler = (ev: PointerEvent): void => {
    this.dragging = false;
    this.player.seek(this.calcCurrentTime(ev.pageX));
    this.player.play();
  };

  private mouseMoveHandler = (ev: MouseEvent): void => {
    ev.preventDefault();
    this.mouseMoveLastX = ev.pageX;
    if (this.mouseMovePending) return;
    this.mouseMovePending = true;
    requestAnimationFrame(this.updateHoverBarAndThumb);
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

    this.player.eachBuffer((start, end) => {
      if (start <= curTime && end >= curTime) {
        percentage = end / this.player.duration;
        return true;
      }
    });

    this.bufBar.setX(percentage);
  }

  updateHoverBarAndThumb = (): void => {
    const left = this.mouseMoveLastX - this.rect.left;
    this.updateHoverBar(left);
    this.updateThumbnail(left);
    this.mouseMovePending = false;
  };

  updateHoverBar(left: number): void {
    this.hoverBar.setX(left / this.rect.width);
  }

  updateThumbnail(left: number): void {
    this.thumbnail.update(left, this.calcCurrentTime(this.mouseMoveLastX));
  }

  onControlsShow(): void {
    this.updatePlayedBar();
    this.updateBufBar();
  }

  onTimeUpdate(): void {
    if (this.dragging) return;
    this.updatePlayedBar();
  }

  onProgress(): void {
    this.updateBufBar();
  }

  destroy(): void {
    this.drag.destroy();
  }
}
