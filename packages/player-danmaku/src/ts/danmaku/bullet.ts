import type { Danmaku } from '.';
import { Timer } from '../utils';

export interface BulletOption {
  color?: string;
  text: string;
  time: number;
  type?: 'top' | 'bottom' | 'scroll';
  isMe?: boolean;
  force?: boolean;
}

export interface BulletSetting {
  track: number;
  // eslint-disable-next-line no-use-before-define
  prev?: Bullet;
}

export class Bullet {
  readonly element: HTMLElement;

  width = 0;

  left = 0;

  length = 0; // w + l

  startAt = 0;

  showAt = 0;

  endAt = 0;

  speed = 0;

  track = 0;

  type!: string;

  ended = false;

  constructor(container: HTMLElement, private danmaku: Danmaku, opts: BulletOption, setting: BulletSetting) {
    this.element = container.appendChild(document.createElement('div'));
    this.element.className = 'rplayer_danmaku_item';
    this.init(opts, setting);
  }

  init(opts: BulletOption, setting: BulletSetting): this {
    this.element.textContent = opts.text;
    this.type = opts.type || 'scroll';
    this.track = setting.track;
    if (opts.color) this.element.style.color = opts.color;
    if (opts.isMe) this.element.classList.add('rplayer_danmaku_item-me');
    const style = this.element.style;
    style.fontSize = `${this.danmaku.fontsize}px`;

    if (this.type === 'bottom' || this.type === 'top') {
      style[this.type] = `${this.track * this.danmaku.trackHeight}px`;
      this.element.classList.add('rplayer_danmaku_item-center');
    } else {
      this.element.addEventListener('transitionend', this.end);
      this.width = this.element.getBoundingClientRect().width + 20;
      const danmakuWidth = this.danmaku.width;
      const prev = setting.prev;
      this.startAt = Timer.now();
      this.left = danmakuWidth;
      this.speed = this.danmaku.speedScale * (danmakuWidth + this.width) / this.danmaku.opts.duration;

      if (prev && !prev.ended) {
        const s = (prev.length - danmakuWidth) - (this.startAt - prev.startAt) * prev.speed;
        if (s >= 0) {
          this.speed = prev.speed;
          this.left += s;
        } else {
          const maxSpeed = this.danmaku.width / (prev.endAt - this.startAt);
          if (this.speed > maxSpeed) this.speed = maxSpeed;
        }
      }

      this.length = this.left + this.width;
      const t = this.length / this.speed;
      this.showAt = this.startAt + (this.length - danmakuWidth) / this.speed;
      this.endAt = this.startAt + t;

      this.updateScrollY();
      style.left = `${this.left}px`;
      style.transition = `transform ${t}s linear`;
      style.transform = `translate3d(-${this.length}px,0,0)`;
    }

    this.ended = false;
    this.show();

    return this;
  }

  updateScrollY(bottomUp = this.danmaku.opts.bottomUp) {
    if (this.type !== 'scroll') return;
    const style = this.element.style;
    style.top = style.bottom = '';
    style[bottomUp ? 'bottom' : 'top'] = `${this.track * this.danmaku.trackHeight}px`;
  }

  end = () => {
    this.element.removeEventListener('transitionend', this.end);
    this.element.style.cssText = '';
    this.element.className = 'rplayer_danmaku_item';
    this.ended = true;
    this.hide();
    this.danmaku.recycleBullet(this);
  }

  show() {
    this.element.style.visibility = 'visible';
  }

  hide() {
    this.element.style.visibility = 'hidden';
  }

  pause(time: number): void {
    const style = this.element.style;
    style.transition = 'transform 0s linear';
    style.transform = `translate3d(-${(time - this.startAt) * this.speed}px,0,0)`;
  }

  run(time: number): void {
    const style = this.element.style;
    style.transition = `transform ${this.endAt - time}s linear`;
    style.transform = `translate3d(-${this.length}px,0,0)`;
  }
}
