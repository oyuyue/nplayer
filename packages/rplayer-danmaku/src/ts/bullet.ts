import { Item } from './options';
import Danmaku from './danmaku';
import RPlayer from 'rplayer';

export default class Bullet {
  private static readonly CENTER_CLS = 'rplayer_dan_d-center';
  private static readonly ME_CLS = 'rplayer_dan_d-me';
  private readonly danmaku: Danmaku;
  readonly dom: HTMLElement;
  item: Item;
  private width = 0;
  private length = 0;
  private destination = 0;
  private lastX = 0;
  startTime = 0;
  showTime = 0;
  endTime = 0;
  tunnel = 0;
  running = false;
  canRecycle = false;

  constructor(
    danmaku: Danmaku,
    item: Item,
    tunnel: number,
    currentTime: number,
    prevBullet?: Bullet
  ) {
    this.danmaku = danmaku;
    this.dom = RPlayer.utils.newElement('rplayer_dan_d');
    this.danmaku.dom.appendChild(this.dom);
    this.reset(item, tunnel, currentTime, prevBullet);
  }

  get isScroll(): boolean {
    return this.item.type === 'scroll' || !this.item.type;
  }

  reset(
    item: Item,
    tunnel: number,
    currentTime: number,
    prevBullet?: Bullet
  ): this {
    this.item = item;
    this.tunnel = tunnel;
    this.startTime = currentTime;
    this.canRecycle = false;

    this.dom.innerText = item.text;

    if (this.isScroll) {
      this.dom.addEventListener('transitionend', this.onTransitionEnd);
      this.width = this.dom.scrollWidth;
      this.dom.style.left = this.danmaku.width + 'px';
      if (item.color) this.dom.style.color = item.color;
      this.length = this.danmaku.width + this.width;
      this.destination = this.length;
      let time = this.danmaku.displaySeconds;
      time /= this.danmaku.opts.speed;
      if (prevBullet) {
        if (prevBullet.showTime > currentTime) {
          this.startTime = prevBullet.showTime;
        }
        const t =
          (this.danmaku.width + this.width) /
          (this.danmaku.width / (prevBullet.endTime - this.startTime));
        if (time < t) time = t;
      }
      this.endTime = this.startTime + time;
      this.showTime = this.startTime + (this.width * time) / this.length + 0.2;
    } else {
      this.dom.style.opacity = '';
      this.endTime = this.startTime + this.danmaku.opts.staticSeconds;
      this.dom.classList.add(Bullet.CENTER_CLS);
    }

    if (item.isMe) {
      this.dom.classList.add(Bullet.ME_CLS);
    }

    this.updateTop();
    this.show();

    return this;
  }

  private onTransitionEnd = (): void => {
    this.canRecycle = true;
  };

  private setTransform(x: number): void {
    this.dom.style.transform = `translateX(-${x}px) translateY(0) translateZ(0)`;
  }

  private setTransition(t: number): void {
    this.dom.style.transition = `transform ${t}s linear`;
  }

  recycle(): this {
    this.canRecycle = true;
    this.running = false;
    this.lastX = 0;
    this.dom.removeEventListener('transitionend', this.onTransitionEnd);
    this.dom.removeAttribute('style');
    this.hide();
    this.dom.classList.remove(Bullet.CENTER_CLS);
    this.dom.classList.remove(Bullet.ME_CLS);
    return this;
  }

  updateTop(): void {
    if (this.tunnel >= this.danmaku.tunnel) {
      return this.hide();
    } else {
      this.show();
    }

    const h = this.tunnel * this.danmaku.tunnelHeight + 'px';
    if (
      this.item.type === 'bottom' ||
      (this.isScroll && this.danmaku.opts.bottomUp)
    ) {
      this.dom.style.bottom = h;
      this.dom.style.top = '';
    } else {
      this.dom.style.top = h;
      this.dom.style.bottom = '';
    }
  }

  show(): void {
    this.dom.style.opacity = '1';
  }

  hide(): void {
    this.dom.style.opacity = '0';
  }

  pause(time: number): void {
    if (!this.isScroll || time <= this.startTime || this.endTime <= time) {
      return;
    }
    const x =
      (this.length / (this.endTime - this.startTime)) *
        (time - this.startTime) +
      this.lastX;
    this.setTransform(x);
    this.setTransition(0);
    this.length = this.danmaku.width - x + this.width;
    this.lastX = x;
    this.running = false;
  }

  destroy(): void {
    this.recycle();
    this.dom.parentNode.removeChild(this.dom);
  }

  update(time: number): boolean {
    if (this.canRecycle || (!this.isScroll && time > this.endTime)) return true;
    if (this.running || this.startTime > time) return false;
    if (this.isScroll) {
      this.startTime = time;
      this.setTransition(
        (this.endTime - time) / this.danmaku.player.playbackRate
      );
      this.dom.offsetTop;
      this.setTransform(this.destination);
    }

    this.running = true;
  }
}
