import { Item } from './options';
import RPlayer from 'rplayer';
import Danmaku from '.';

export default class Dan {
  private readonly danmaku: Danmaku;
  readonly dom: HTMLElement;
  type: string;
  private tunnel: number;
  private length: number;
  private showFrame = 0;
  private _width = 0;
  speed = 0;
  canRecycle = false;

  constructor(
    danmaku: Danmaku,
    item: Item,
    tunnel: number,
    length?: number,
    speed?: number
  ) {
    this.danmaku = danmaku;
    this.dom = RPlayer.utils.newElement('rplayer_dan_d');
    danmaku.dom.appendChild(this.dom);
    this.reset(item, tunnel, length, speed);
  }

  get width(): number {
    if (this._width) return this._width;
    this._width = this.measure().width;
    return this._width;
  }

  get invisibleLength(): number {
    return this.width + this.length;
  }

  private measure(): DOMRect {
    const rect = this.dom.getBoundingClientRect();
    if (rect.height) this.danmaku.updateTunnelHeight(rect.height + 1);
    return rect;
  }

  reset(item: Item, tunnel: number, length?: number, speed?: number): this {
    this.dom.innerText = item.text;
    if (item.color) this.dom.style.color = item.color;
    if (item.fontFamily) this.dom.style.fontFamily = item.color;
    if (item.isMe) this.dom.classList.add('rplayer_dan_d-me');
    this.type = item.type;
    this.tunnel = tunnel;

    this.updateVertical();

    if (!this.type || this.type === 'scroll') {
      this.length = Math.max(length, 0) + this.danmaku.fontSize;

      if (length >= 0 && speed) {
        this.speed = speed;
      } else {
        const playerWidth = this.danmaku.player.rect.width;
        const d = playerWidth + this.length;
        this.speed = (this.width + d) / this.danmaku.opts.scrollFrame;

        if (speed && length < 0) {
          const s = (d * speed) / (playerWidth + length);
          if (s < this.speed) this.speed = s;
        }
      }

      this.updateX();
      this.dom.style.right = `-${this.width}px`;
    } else {
      this.dom.classList.add('rplayer_dan_d-center');
    }
    this.canRecycle = false;

    this.show();

    return this;
  }

  updateVertical(): void {
    this.dom.style[this.type === 'bottom' ? 'bottom' : 'top'] =
      this.tunnel * this.danmaku.tunnelHeight + 'px';
  }

  private updateX(): void {
    this.dom.style.transform = `translateX(${this.length}px)`;
  }

  private show(): void {
    this.dom.hidden = false;
  }

  private hide(): void {
    this.dom.hidden = true;
  }

  update(): void {
    if (this.canRecycle) return;
    if (this.type === 'top' || this.type === 'bottom') {
      if (this.showFrame > this.danmaku.opts.staticFrame) {
        this.canRecycle = true;
        this.hide();
        return;
      }
      this.showFrame++;
    } else {
      if (-this.length >= this.danmaku.player.rect.width + this.width) {
        this.canRecycle = true;
        this.hide();
        return;
      }
      this.length -= this.speed;
      this.updateX();
    }
  }

  recycle(): void {
    this.canRecycle = true;
    this.showFrame = 0;
    this._width = 0;
    this.speed = 0;
    this.dom.style.color = '';
    this.dom.style.fontFamily = '';
    this.dom.style.right = '';
    this.dom.style.top = '';
    this.dom.style.bottom = '';
    this.dom.style.transform = '';
    this.dom.classList.remove('rplayer-dan-me');
    this.dom.classList.remove('rplayer_dan_d-center');
    this.hide();
  }

  destroy(): void {
    this.hide();
    if (this.dom.parentNode) {
      this.dom.parentNode.removeChild(this.dom);
    }
    this.canRecycle = true;
  }
}
