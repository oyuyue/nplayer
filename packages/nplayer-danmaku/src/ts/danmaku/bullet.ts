import type { Danmaku } from '.';

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

const itemClass = 'nplayer_danmaku_item';

export class Bullet {
  readonly el: HTMLElement;

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

  color = '';

  private centerTimer!: any;

  constructor(container: HTMLElement, private danmaku: Danmaku, opts: BulletOption, setting: BulletSetting) {
    this.el = container.appendChild(document.createElement('div'));
    this.el.className = itemClass;
    this.init(opts, setting);
  }

  init(opts: BulletOption, setting: BulletSetting): this {
    this.el.textContent = opts.text;
    this.type = opts.type || 'scroll';
    this.track = setting.track;
    if (opts.color) this.el.style.color = this.color = opts.color;
    if (opts.isMe) this.el.classList.add('nplayer_danmaku_item-me');
    const style = this.el.style;
    style.fontSize = `${this.danmaku.fontsize}px`;

    this.startAt = this.danmaku.timer.now();

    if (this.type === 'scroll') {
      this.el.addEventListener('transitionend', this.end);
      const rect = this.el.getBoundingClientRect();
      this.width = (this.danmaku.heightGtWidth ? rect.height : rect.width) + 20;
      const danmakuWidth = this.danmaku.width;
      const prev = setting.prev;
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
    } else {
      style[this.type as any] = this.pos();
      this.el.classList.add('nplayer_danmaku_item-center');
      const duration = this.danmaku.speedScale * this.danmaku.opts.duration;
      this.endAt = this.startAt + duration;
      this.centerTimer = setTimeout(this.end, duration * 1000);
    }

    this.ended = false;
    this.show();

    if (this.danmaku.paused) this.pause(this.startAt);

    return this;
  }

  private pos(): string {
    return `${this.track * this.danmaku.trackHeight + 2}px`;
  }

  updateScrollY(bottomUp = this.danmaku.opts.bottomUp) {
    if (this.type !== 'scroll') return;
    const style = this.el.style;
    style.top = style.bottom = '';
    style[bottomUp ? 'bottom' : 'top'] = this.pos();
  }

  end = () => {
    this.el.removeEventListener('transitionend', this.end);
    clearTimeout(this.centerTimer);
    this.el.style.cssText = '';
    this.color = '';
    this.el.className = itemClass;
    this.ended = true;
    this.hide();
    this.danmaku.recycleBullet(this);
  }

  show() {
    this.el.style.visibility = '';
  }

  hide() {
    this.el.style.visibility = 'hidden';
  }

  pause(time: number): void {
    if (this.type === 'scroll') {
      const style = this.el.style;
      style.transition = 'transform 0s linear';
      style.transform = `translate3d(-${(time - this.startAt) * this.speed}px,0,0)`;
    } else {
      clearTimeout(this.centerTimer);
    }
  }

  run(time: number): void {
    if (this.type === 'scroll') {
      const style = this.el.style;
      style.transition = `transform ${this.endAt - time}s linear`;
      style.transform = `translate3d(-${this.length}px,0,0)`;
    } else {
      this.centerTimer = setTimeout(this.end, (this.endAt - time) * 1000);
    }
  }
}
