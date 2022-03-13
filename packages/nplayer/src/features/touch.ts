import { ToastItem } from '../parts';
import { Player } from '../player';
import { Disposable } from '../types';
import {
  clamp, formatTime, throttle,
} from '../utils';

export class Touch implements Disposable {
  private startX = 0;

  private duration = 0;

  private durationStr = '';

  private currentTime = 0;

  private seekTime = -1;

  private toastItem!: ToastItem;

  private showControlTimer!: any;

  private videoTouched = false;

  private dragged = false;

  constructor(private player: Player) {
    if (player.opts.isTouch) {
      this.enable();
    }
  }

  private onTouchStart = (ev: TouchEvent) => {
    if (ev.touches.length !== 1) return;
    ev.preventDefault();

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

  private onTouchMove = throttle((ev: TouchEvent) => {
    if (ev.touches.length !== 1) return;
    ev.preventDefault();

    if (this.dragged) {
      const distance = ev.touches[0].clientX - this.startX;
      if (Math.abs(distance) < 15) return;
      this.seekTime = clamp(this.currentTime + distance / 5, 0, this.duration) | 0;
      this.toastItem = this.player.toast.show(`${formatTime(this.seekTime)} · ${this.durationStr}`, 'center', 0);
    } else {
      this.duration = this.player.duration;
      if (!this.player.opts.live && this.duration) {
        this.durationStr = formatTime(this.duration);
        this.currentTime = this.player.currentTime;
        this.startX = ev.touches[0].clientX;
        this.seekTime = -1;
        this.dragged = true;
      }
    }
  })

  private onTouchEnd = () => {
    if (!this.dragged) return;
    this.dragged = false;
    if (this.toastItem) {
      setTimeout(() => this.player.toast.close(this.toastItem), 200);
    }
    if (this.seekTime >= 0 && Math.abs(this.seekTime - this.player.currentTime) > 3) {
      this.player.currentTime = this.seekTime;
    }
  }

  enable(): void {
    this.player.video.addEventListener('touchstart', this.onTouchStart);
    this.player.video.addEventListener('touchmove', this.onTouchMove);
    this.player.video.addEventListener('touchend', this.onTouchEnd);
    this.player.video.addEventListener('touchcancel', this.onTouchEnd);
  }

  disable(): void {
    this.player.video.removeEventListener('touchstart', this.onTouchStart);
    this.player.video.removeEventListener('touchmove', this.onTouchMove);
    this.player.video.removeEventListener('touchend', this.onTouchEnd);
    this.player.video.removeEventListener('touchcancel', this.onTouchEnd);
  }

  dispose() {
    if (this.toastItem) {
      this.player.toast.close(this.toastItem);
    }
    this.disable();
  }
}
