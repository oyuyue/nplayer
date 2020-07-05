import { Item } from './options';
import Danmaku from '.';

export default class Bullet {
  private readonly ctx: CanvasRenderingContext2D;
  private readonly danmaku: Danmaku;
  item: Item;
  prevBullet: Bullet;
  width = 0;
  x = 0;
  y = 0;
  speed = 0;
  actualSpeed = 0;
  tunnel = 0;
  displayedFrames = 0;
  visible = true;

  constructor(
    danmaku: Danmaku,
    item: Item,
    tunnel: number,
    prevBullet?: Bullet
  ) {
    this.danmaku = danmaku;
    this.ctx = danmaku.ctx;
    this.reset(item, tunnel, prevBullet);
  }

  get length(): number {
    return this.x + this.width;
  }

  get canRecycle(): boolean {
    if (this.isScroll) return -this.x > this.width;
    return this.displayedFrames > this.danmaku.opts.staticFrames;
  }

  get isScroll(): boolean {
    return this.item.type === 'scroll' || !this.item.type;
  }

  reset(item: Item, tunnel: number, prevBullet?: Bullet): this {
    this.item = item;
    this.tunnel = tunnel;
    this.width = this.ctx.measureText(item.text).width;

    if (this.isScroll) {
      this.prevBullet = prevBullet;
      this.x = Math.max(prevBullet?.length ?? 0, this.danmaku.width);
      this.updateSpeed();
    } else {
      this.x = (this.danmaku.width - this.width) / 2;
    }

    this.updateY();

    return this;
  }

  recycle(): this {
    this.prevBullet = null;
    return this;
  }

  updateSpeed(): void {
    if (this.prevBullet && this.prevBullet.length > this.danmaku.width) {
      this.speed = this.prevBullet.speed;
    } else {
      this.speed = this.length / this.danmaku.displayFrames;

      if (this.prevBullet) {
        const maxSpeed =
          (this.x * this.prevBullet.speed) / this.prevBullet.length;
        if (this.speed > maxSpeed) this.speed = maxSpeed;
      }
    }
    this.updateActualSpeed();
  }

  updateActualSpeed(): void {
    if (this.isScroll) {
      this.actualSpeed = this.speed * this.danmaku.opts.speed;
    }
  }

  updateY(): void {
    if (
      this.item.type === 'bottom' ||
      (this.isScroll && this.danmaku.opts.bottomUp)
    ) {
      this.y = this.danmaku.height - this.tunnel * this.danmaku.tunnelHeight;
    } else {
      this.y = this.tunnel * this.danmaku.tunnelHeight;
    }
  }

  show(): void {
    this.visible = true;
  }

  hide(): void {
    this.visible = false;
  }

  display(): void {
    if (this.isScroll) {
      this.x -= this.actualSpeed;
      if (this.x > this.danmaku.width) return;
    } else {
      this.displayedFrames += 1;
    }

    if (!this.visible || this.tunnel > this.danmaku.tunnel) return;

    this.ctx.fillStyle = this.item.color || '#fff';
    this.ctx.fillText(this.item.text, this.x, this.y);
  }
}
