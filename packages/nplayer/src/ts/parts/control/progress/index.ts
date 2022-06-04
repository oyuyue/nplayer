import { EVENT } from 'src/ts/constants';
import { Player } from 'src/ts/player';
import {
  $, addClass, addDisposable, addDisposableListener, clamp, Component, Drag, Rect, throttle,
} from 'src/ts/utils';
import { ControlItem } from '..';
import { Thumbnail } from './thumbnail';

export class Progress extends Component implements ControlItem {
  readonly id = 'progress'

  private playedBar!: HTMLElement;

  private bufBar!: HTMLElement;

  private bars!: HTMLElement;

  private dot!: HTMLElement;

  private rect!: Rect;

  private thumbnail!: Thumbnail;

  private player!: Player;

  private dragging = false;

  init(player: Player) {
    this.player = player;

    addClass(this.el, 'progress');

    this.bars = this.el.appendChild($('.progress_bars'));
    this.bufBar = this.bars.appendChild($('.progress_buf'));
    this.playedBar = this.bars.appendChild($('.progress_played'));
    this.dot = this.el.appendChild($('.progress_dot'));
    this.dot.appendChild(player.opts.progressDot || $('.progress_dot_inner'));

    this.rect = addDisposable(this, new Rect(this.bars, player));
    this.thumbnail = addDisposable(this, new Thumbnail(this.el, player.opts.thumbnail));

    addDisposable(this, new Drag(this.el, this.onDragStart, this.onDragging, this.onDragEnd));
    addDisposable(this, player.on(EVENT.TIME_UPDATE, this.updatePlayedBar));
    addDisposable(this, player.on(EVENT.PROGRESS, this.updateBufBar));
    addDisposable(this, player.on(EVENT.UPDATE_OPTIONS, () => this.thumbnail.updateOptions(player.opts.thumbnail)));
    addDisposable(this, player.on(EVENT.UPDATE_SIZE, () => {
      if (!player.playing) this.resetPlayedBar();
    }));
    addDisposable(this, player.on(EVENT.CONTROL_ITEM_UPDATE, () => {
      this.rect.update();
      this.resetPlayedBar();
    }));
    addDisposableListener(this, this.el, 'mousemove', throttle((ev: MouseEvent) => this.updateThumbnail(ev)), true);

    if (player.opts.isTouch) {
      addDisposableListener(this, this.el, 'touchstart', (ev: Event) => ev.preventDefault());
    }
  }

  private resetPlayedBar() {
    this.setPlayedBarLength(this.player.currentTime / this.player.duration);
  }

  private setPlayedBarLength(percentage: number): void {
    this.playedBar.style.transform = `scaleX(${clamp(percentage)})`;
    const w = (this.rect.isHeightGtWidth ? this.rect.height : this.rect.width);
    this.dot.style.transform = `translate(${clamp(percentage * w, 0, w)}px, -50%)`;
  }

  private setBufBarLength(percentage: number): void {
    this.bufBar.style.transform = `scaleX(${clamp(percentage)})`;
  }

  private onDragStart = (ev: PointerEvent) => {
    this.dragging = true;
    this.rect.update();
    this.onDragging(ev);
  }

  private onDragging = (ev: PointerEvent) => {
    const isHeightGtWidth = this.rect.isHeightGtWidth;
    const x = isHeightGtWidth ? (ev.clientY - this.rect.y) : (ev.clientX - this.rect.x);
    this.setPlayedBarLength(x / (isHeightGtWidth ? this.rect.height : this.rect.width));
    this.updateThumbnail(ev);
  }

  private onDragEnd = (ev: PointerEvent) => {
    this.dragging = false;
    const isHeightGtWidth = this.rect.isHeightGtWidth;
    this.player.seek(this.getCurrentTime(isHeightGtWidth ? ev.clientY : ev.clientX, isHeightGtWidth));
  }

  private updateThumbnail(ev: MouseEvent): void {
    this.rect.update();
    const isHeightGtWidth = this.rect.isHeightGtWidth;
    const x = isHeightGtWidth ? ev.clientY : ev.clientX;
    this.thumbnail.update(
      this.getCurrentTime(x, isHeightGtWidth),
      x - (isHeightGtWidth ? this.rect.y : this.rect.x), isHeightGtWidth ? this.rect.height : this.rect.width,
    );
  }

  private updateBufBar = (): void => {
    const bufLen = this.player.buffered.length;

    if (!bufLen) return this.setBufBarLength(0);

    const curTime = this.player.currentTime;
    let percentage = 0;

    this.player.eachBuffer((start, end) => {
      if (start <= curTime && end >= curTime) {
        percentage = end / this.player.duration;
        return true;
      }
    });

    this.setBufBarLength(percentage);
  }

  private updatePlayedBar = (): void => {
    if (this.dragging) return;
    this.setPlayedBarLength(this.player.currentTime / this.player.duration);
  }

  private getCurrentTime(x: number, isHeightGtWidth: boolean): number {
    return clamp(
      ((x - (isHeightGtWidth ? this.rect.y : this.rect.x)) / (isHeightGtWidth ? this.rect.height : this.rect.width)),
    ) * this.player.duration;
  }
}

export const progressControlItem = () => new Progress();
