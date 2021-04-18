import type { Disposable, Player } from 'nplayer';
import {
  getStorageOptions, isDefaultColor, setStorageOptions, Timer, EVENT,
} from '../utils';
import { Bullet, BulletOption, BulletSetting } from './bullet';

export interface DanmakuOptions {
  disable?: boolean;
  blocked?: Array<'scroll' | 'top' | 'bottom' | 'color'>;
  fontsize?: number;
  fontsizeScale?: number;
  opacity?: number;
  speed?: number;
  area?: 0.25 | 0.5 | 0.75 | 1;
  unlimited?: boolean;
  bottomUp?: boolean;
  colors?: string[];
  duration?: number;
  items?: BulletOption[];
  zIndex?: number;
  persistOptions: boolean;
  discard?: (b: BulletOption) => boolean;
}

export const defaultOptions = (): Required<DanmakuOptions> => ({
  disable: false,
  blocked: [],
  fontsize: 24,
  fontsizeScale: 1,
  opacity: 1,
  speed: 1,
  area: 0.5,
  unlimited: false,
  bottomUp: false,
  colors: ['#FE0302', '#FF7204', '#FFAA02', '#FFD302', '#FFFF00', '#A0EE00', '#00CD00', '#019899', '#4266BE', '#89D5FF', '#CC0273', '#222222', '#9B9B9B', '#FFFFFF'],
  duration: 5,
  items: [],
  zIndex: 5,
  persistOptions: false,
  discard() { return false; },
});

export class Danmaku implements Disposable {
  element: HTMLElement;

  opts: Required<DanmakuOptions>;

  enabled = false;

  paused = false;

  track = 0;

  trackHeight = 0;

  private bulletPool: Bullet[] = [];

  private aliveBullets: Set<Bullet> = new Set();

  private scrollBullets: (Bullet | undefined)[] = [];

  private topBullets: number[] = [];

  private bottomBullets: number[] = [];

  private items: BulletOption[] = [];

  private pos = 0;

  private prevPauseTime = 0;

  constructor(private player: Player, private _opts?: DanmakuOptions) {
    this.opts = { ...defaultOptions(), ...getStorageOptions(), ..._opts };

    const { $, addDisposable } = player.Player._utils;
    this.element = player.element.appendChild($('.danmaku_screen'));
    this.element.style.zIndex = String(this.opts.zIndex);

    this.items = this.opts.items;

    if (!this.opts.disable) this.enable();

    addDisposable(this, player.on(player.EVENT.MOUNTED, () => {
      this.updateTrack();
    }));

    addDisposable(player, this);
  }

  get width(): number {
    return this.player.rect.width;
  }

  get currentTime(): number {
    return this.player.currentTime;
  }

  get playbackRate(): number {
    return this.player.playbackRate;
  }

  get fontsize(): number {
    return this.opts.fontsize * this.opts.fontsizeScale;
  }

  get speedScale(): number {
    return this.playbackRate * this.opts.speed;
  }

  private createBullet(item: BulletOption, setting: BulletSetting): Bullet {
    let bullet = this.bulletPool.pop();
    if (bullet) {
      bullet.init(item, setting);
    } else {
      bullet = new Bullet(this.element, this, item, setting);
    }
    this.aliveBullets.add(bullet);
    return bullet;
  }

  private getShortestTrack(): [number, Bullet | undefined] {
    let shortest = this.scrollBullets[0];
    if (!shortest || shortest.ended) return [0] as any;
    for (let i = 1, item; i < this.track; ++i) {
      item = this.scrollBullets[i];
      if (!item || item.ended) return [i] as any;
      if (shortest.showAt > item.showAt) shortest = item;
    }
    return [shortest.track, shortest];
  }

  private getEmptyTrack(time: number, list: number[]): number {
    for (let i = 0; i < this.track; ++i) {
      if (!list[i] || list[i] <= time) return i;
    }
    return -1;
  }

  private shouldDiscard(item: BulletOption): boolean {
    if (this.opts.blocked.includes(item.type || 'scroll')) return true;
    if (this.opts.discard(item)) return true;
    if (!item.color || !this.opts.blocked.includes('color')) return false;
    return !isDefaultColor(item.color);
  }

  private fire = () => {
    if (!this.enabled || !this.player.playing) return;
    if (this.paused) this.resume();
    const currentTime = this.currentTime;
    const inc = this.opts.unlimited ? 0.5 : 1;
    const min = currentTime - inc;
    const max = currentTime + inc;
    let item: BulletOption;
    const time = Timer.now();
    for (let l = this.items.length; this.pos < l; this.pos++) {
      item = this.items[this.pos];
      if (item.time < min) continue;
      if (item.time > max) break;
      if (this.shouldDiscard(item)) continue;
      if (!this.insert(item, time)) break;
    }
  }

  private updateTrack(): void {
    this.trackHeight = this.fontsize + 5;
    this.track = Math.floor(this.player.rect.height * this.opts.area / this.trackHeight);
  }

  private onSeeked = () => {
    this.clearScreen();
    this.pos = 0;
  }

  private storeOptions() {
    this.player.emit(EVENT.DANMAKU_UPDATE_OPTIONS, this.opts);
    if (this.opts.persistOptions) {
      const opts = this.opts;
      setStorageOptions({
        blocked: opts.blocked,
        fontsizeScale: opts.fontsizeScale,
        opacity: opts.opacity,
        speed: opts.speed,
        area: opts.area,
        unlimited: opts.unlimited,
        bottomUp: opts.bottomUp,
      } as DanmakuOptions);
    }
  }

  recycleBullet(bullet: Bullet): void {
    this.bulletPool.push(bullet);
    this.aliveBullets.delete(bullet);
    if (bullet.type === 'scroll' && this.scrollBullets[bullet.track] === bullet) this.scrollBullets[bullet.track] = undefined;
  }

  insert(item: BulletOption, time: number): boolean {
    if (!item.type || item.type === 'scroll') {
      const [track, bullet] = this.getShortestTrack();
      const canDiscard = !item.force && bullet && bullet.showAt > (time + 2);
      if (canDiscard && !this.opts.unlimited) return false;
      this.scrollBullets[track] = this.createBullet(item, { track, prev: canDiscard ? undefined : bullet });
      return true;
    }

    const list = item.type === 'top' ? this.topBullets : this.bottomBullets;
    let track = this.getEmptyTrack(time, list);
    track = track === -1 && item.force ? 0 : track;
    if (track !== -1) {
      list[track] = this.createBullet(item, { track }).endAt;
      return true;
    }
    return false;
  }

  send(opts: BulletOption): void {
    if (opts.time == null) opts.time = this.currentTime;
    opts = { isMe: true, force: true, ...opts };
    this.player.emit(EVENT.DANMAKU_SEND, opts);
    const i = this.addItem(opts);
    if (this.pos > i) {
      this.insert(opts, Timer.now());
    }
  }

  pause = () => {
    this.prevPauseTime = Timer.now();
    Timer.pause();
    this.aliveBullets.forEach((bullet) => bullet.pause(this.prevPauseTime));
    this.paused = true;
  }

  resume = () => {
    if (!this.player.playing || this.player.loading.isActive) {
      return;
    }

    Timer.play();
    this.aliveBullets.forEach((bullet) => bullet.run(this.prevPauseTime));
    this.paused = false;
  }

  getItems(): BulletOption[] {
    return this.items;
  }

  addItem(opts: BulletOption): number {
    if (opts.time == null) return -1;
    let index = 0;
    for (let i = 0, l = this.items.length; i < l; i++) {
      if (this.items[i].time > opts.time) {
        index = i;
        break;
      }
    }

    this.items.splice(index, 0, opts);
    return index;
  }

  appendItems(items: BulletOption[]): void {
    this.items = this.items.concat(items);
  }

  resetItems(items: BulletOption[]): void {
    this.items = items;
    this.pos = 0;
  }

  updateOpacity(opacity = this.opts.opacity): void {
    this.element.style.opacity = String(opacity);
    this.storeOptions();
  }

  updateFontsize(scale = this.opts.fontsizeScale): void {
    this.opts.fontsizeScale = scale;
    this.updateTrack();
    this.storeOptions();
  }

  updateArea(area: Required<DanmakuOptions>['area']): void {
    if (![0.25, 0.5, 0.75, 1].includes(area)) return;
    this.opts.area = area;
    this.updateTrack();
    this.storeOptions();
  }

  updateUnlimited(unlimited: boolean): void {
    this.opts.unlimited = unlimited;
    this.storeOptions();
  }

  updateBottomUp(bottomUp: boolean): void {
    this.opts.bottomUp = bottomUp;
    this.aliveBullets.forEach((b) => b.updateScrollY(bottomUp));
    this.storeOptions();
  }

  updateSpeed(v: number): void {
    this.opts.speed = v;
    this.storeOptions();
  }

  blockType(type: Required<DanmakuOptions>['blocked'][0]): void {
    if (this.opts.blocked.includes(type)) return;
    this.opts.blocked.push(type);
    this.aliveBullets.forEach((b) => {
      if (b.type === type || (type === 'color' && !isDefaultColor(b.color))) {
        b.hide();
      }
    });
    this.storeOptions();
  }

  allowType(type: Parameters<Danmaku['blockType']>[0]): void {
    this.opts.blocked = this.opts.blocked.filter((t) => t !== type);
    this.aliveBullets.forEach((b) => {
      if (b.type === type || (type === 'color' && !isDefaultColor(b.color))) {
        b.show();
      }
    });
    this.storeOptions();
  }

  resetOptions(): void {
    this.opts.blocked.forEach((t) => {
      this.allowType(t);
    });
    this.opts = { ...defaultOptions(), ...this._opts };
    this.opts.blocked = [];
    this.updateOpacity();
    this.updateFontsize();
    this.updateBottomUp(this.opts.bottomUp);
  }

  clearScreen() {
    Array.from(this.aliveBullets).forEach((b) => b.end());
    this.topBullets = [];
    this.bottomBullets = [];
  }

  enable(): void {
    if (this.enabled) return;
    this.enabled = true;
    const EV = this.player.EVENT;
    this.player.on(EV.TIME_UPDATE, this.fire);
    this.player.on(EV.PAUSE, this.pause);
    this.player.on(EV.ENDED, this.pause);
    this.player.on(EV.PLAY, this.resume);
    this.player.on(EV.SEEKED, this.onSeeked);
    this.player.on(EV.LOADING_SHOW, this.pause);
    this.player.on(EV.LOADING_HIDE, this.resume);
  }

  disable(): void {
    this.enabled = false;
    this.clearScreen();
    const EV = this.player.EVENT;
    this.player.off(EV.TIME_UPDATE, this.fire);
    this.player.off(EV.PAUSE, this.pause);
    this.player.off(EV.ENDED, this.pause);
    this.player.off(EV.PLAY, this.resume);
    this.player.off(EV.SEEKED, this.onSeeked);
    this.player.off(EV.LOADING_SHOW, this.pause);
    this.player.off(EV.LOADING_HIDE, this.resume);
  }

  dispose(): void {
    if (!this.player) return;
    this.disable();
    this.player.Player._utils.removeNode(this.element);
    this.player.Player._utils.dispose(this);
    this.player = null!;
    this.bulletPool = null!;
    this.aliveBullets = null!;
    this.scrollBullets = null!;
    this.topBullets = null!;
    this.bottomBullets = null!;
    this.items = null!;
    this.element = null!;
    this.opts = null!;
  }

  EVENT!: typeof EVENT
}

Danmaku.prototype.EVENT = EVENT;
