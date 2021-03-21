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
  prevShowAt?: number;
}

export class Bullet {
  readonly element: HTMLElement;

  width = 0;

  showAt = 0;

  track = 0;

  type!: string;

  constructor(container: HTMLElement, private danmaku: Danmaku, opts: BulletOption, setting: BulletSetting) {
    this.element = container.appendChild(document.createElement('div'));
    this.init(opts, setting);
  }

  init(opts: BulletOption, setting: BulletSetting): this {
    const duration = this.danmaku.opts.duration * this.danmaku.opts.speed;

    this.element.className = 'rplayer_danmaku_item';
    this.element.textContent = opts.text;
    this.type = opts.type || 'scroll';
    if (opts.color) this.element.style.color = opts.color;
    if (opts.type && opts.type !== 'scroll') this.element.classList.add('rplayer_danmaku_item-center');
    if (opts.isMe) this.element.classList.add('rplayer_danmaku_item-me');
    const style = this.element.style;
    style.transform = `translate3d(${this.danmaku.width}px,0,0)`;
    style.animationName = 'danmaku-item';
    style.animationTimingFunction = 'linear';
    style.animationDuration = `${duration}s`;

    const currentTime = this.danmaku.currentTime;
    this.width = this.element.getBoundingClientRect().width;
    this.showAt = this.width * duration / (this.danmaku.width + this.width) + currentTime + (setting.prevShowAt || 0);

    if (setting.prevShowAt) style.animationDelay = `${setting.prevShowAt - currentTime}s`;

    this.track = setting.track;

    style.top = `${this.track * this.danmaku.trackHeight}px`;

    this.element.addEventListener('animationend', this.onAnimationEnd);

    this.show();

    if (this.danmaku.paused) {
      this.pause();
    } else {
      this.run();
    }

    return this;
  }

  private onAnimationEnd = () => {
    this.hide();
    this.danmaku.recycleBullet(this);
  }

  show() {
    this.element.style.visibility = 'visible';
  }

  hide() {
    this.element.style.visibility = 'hidden';
  }

  pause(): void {
    this.element.style.animationPlayState = 'paused';
  }

  run(): void {
    this.element.style.animationPlayState = 'running';
  }

  updateSpeed() {
    this.element.style.animationDuration = `${this.danmaku.opts.duration * this.danmaku.opts.speed}s`;
  }
}
