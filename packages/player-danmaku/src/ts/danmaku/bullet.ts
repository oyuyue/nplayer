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
    if (opts.type && opts.type !== 'scroll') this.element.classList.add('rplayer_danmaku_item-center');
    if (opts.isMe) this.element.classList.add('rplayer_danmaku_item-me');
    const style = this.element.style;
    style.top = `${this.track * this.danmaku.trackHeight}px`;
    style.fontSize = `${this.danmaku.fontsize}px`;

    if (this.type === 'scroll') {
      this.element.addEventListener('transitionend', this.onTransitionEnd);

      this.width = this.element.getBoundingClientRect().width + 20;
      const danmakuWidth = this.danmaku.width;
      const prev = setting.prev;
      this.startAt = this.danmaku.currentTime;
      this.left = danmakuWidth;
      this.speed = this.danmaku.opts.speed * (danmakuWidth + this.width) / this.danmaku.opts.duration;

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
      style.left = `${this.left}px`;
      style.transition = `transform ${t}s linear`;
      style.transform = `translate3d(-${this.length}px,0,0)`;
    }

    this.ended = false;
    this.show();

    return this;
  }

  private onTransitionEnd = () => {
    this.element.removeEventListener('animationend', this.onTransitionEnd);
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

  pause(currentTime = this.danmaku.currentTime): void {
    const style = this.element.style;
    style.transition = 'transform 0s linear';
    style.transform = `translate3d(-${(currentTime - this.startAt) * this.speed}px,0,0)`;
  }

  run(currentTime = this.danmaku.currentTime): void {
    const style = this.element.style;
    style.transition = `transform ${this.endAt - currentTime}s linear`;
    style.transform = `translate3d(-${this.length}px,0,0)`;
  }
}
