import { ToastItem } from '../parts';
import { Player } from '../player';
import { Disposable } from '../types';
import {
  clamp, Drag, formatTime,
} from '../utils';

export class Touch implements Disposable {
  private startX = 0;

  private startY = 0;

  private dragType = 0;

  private duration = 0;

  private durationStr = '';

  private currentTime = 0;

  private volume = 0;

  private seekTime = 0;

  private toastItem!: ToastItem;

  private drag!: Drag;

  private showControlTimer!: any;

  private videoTouched = false;

  constructor(private player: Player) {
    if (player.opts.isTouch) {
      this.enable();
    }
  }

  private dragStart = (ev: PointerEvent) => {
    this.duration = this.player.duration;
    if (!this.duration) return;
    this.durationStr = formatTime(this.duration);
    this.currentTime = this.player.currentTime;
    this.volume = this.player.volume;
    this.startX = ev.pageX;
    this.startY = ev.pageY;
    this.dragType = 0;
    this.seekTime = 0;
  }

  private dragMove = (ev: PointerEvent) => {
    if (!this.duration) return;
    if (this.dragType === 1) {
      if (this.player.opts.live) return;
      this.seekTime = clamp(this.currentTime + (ev.pageX - this.startX) / 5, 0, this.duration) | 0;
      this.toastItem = this.player.toast.show(`${formatTime(this.seekTime)} · ${this.durationStr}`, 'center', 0);
    } else if (this.dragType === 2) {
      const volume = clamp(this.volume + (this.startY - ev.pageY) / 200);
      this.toastItem = this.player.toast.show(`${volume * 100 | 0}%`, 'center', 0);
      this.player.volume = volume;
    } else if (Math.abs(ev.pageX - this.startX) > 20) {
      this.dragType = 1;
    } else if (Math.abs(ev.pageY - this.startY) > 20) {
      this.dragType = 2;
    }
  }

  private dragEnd = () => {
    if (this.toastItem) {
      setTimeout(() => this.player.toast.close(this.toastItem), 200);
    }
    if (!this.duration) return;
    if (this.dragType === 1) {
      this.player.currentTime = this.seekTime;
    }
  }

  private videoTouchHandler = () => {
    if (this.videoTouched) {
      clearTimeout(this.showControlTimer);
      this.videoTouched = false;
      this.player.toggle();
    } else {
      this.videoTouched = true;
      this.showControlTimer = setTimeout(() => {
        this.videoTouched = false;
        const control = this.player.control;
        if (control.isActive) {
          control.hide();
        } else {
          control.showTransient();
        }
      }, 200);
    }
  }

  enable(): void {
    if (this.drag) return;
    this.drag = new Drag(this.player.video, this.dragStart, this.dragMove, this.dragEnd);
    this.player.video.addEventListener('touchstart', this.videoTouchHandler);
  }

  disable(): void {
    if (this.drag) {
      this.drag.dispose();
      this.drag = null!;
    }
    this.player.video.removeEventListener('touchstart', this.videoTouchHandler);
  }

  dispose() {
    if (this.toastItem) {
      this.player.toast.close(this.toastItem);
    }
    this.disable();
  }
}
