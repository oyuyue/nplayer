import RPlayer from 'rplayer';
import processOpts, { Item, DanmakuOptions } from './options';
import UI from './ui';
import Bullet from './bullet';

export default class Danmaku {
  private DEFAULT_SETTING: DanmakuOptions;
  static readonly typeMap: Item['type'][] = ['scroll', 'top', 'bottom'];

  player: RPlayer;
  ui: UI;
  opts: DanmakuOptions;
  tunnel = 0;
  tunnelHeight = 0;
  private running = false;
  private timer: number;
  private remain: Item[] = [];
  private prevCurrentTime = -1;

  readonly ctx: CanvasRenderingContext2D;
  readonly dom: HTMLCanvasElement;
  private bullets: Bullet[] = [];
  private scroll: Bullet[] = [];
  private top: Bullet[] = [];
  private bottom: Bullet[] = [];
  private pool: Bullet[] = [];
  displayFrames = 500;

  constructor(opts: DanmakuOptions) {
    this.dom = RPlayer.utils.newElement('rplayer_dan', 'canvas');
    this.ctx = this.dom.getContext('2d');
    this.opts = processOpts(opts);
    this.setDefaultOptions(this.opts);
    this.remain = [...this.opts.items];
  }

  install(player: RPlayer): void {
    this.player = player;
    this.restoreSetting();

    this.player.appendChild(this.dom);
    this.updateSetting();

    player.on(RPlayer.Events.LOADED_METADATA, this.onLoadedMetadata);
    player.on(RPlayer.Events.PAUSE, this.stop);
    player.on(RPlayer.Events.LOADING_SHOW, this.stop);
    player.on(RPlayer.Events.LOADING_HIDE, this.start);
    player.on(RPlayer.Events.PLAY, this.start);
    player.on(RPlayer.Events.ENDED, this.stop);
    player.on(RPlayer.Events.TIME_UPDATE, this.onTimeUpdate);
    player.on(RPlayer.Events.PLAYER_RESIZE, this.onResize);
    player.on(RPlayer.Events.SEEKED, this.onPlayerSeeked);

    this.ui = new UI(this);

    if (document.contains(this.player.dom)) {
      this.run();
    } else {
      player.once(RPlayer.Events.MOUNTED, this.run);
    }
  }

  get defaultSetting(): DanmakuOptions {
    const setting = { ...this.DEFAULT_SETTING };
    setting.blockTypes = [...setting.blockTypes];
    return setting;
  }

  get fontSize(): number {
    return this.opts.baseFontSize * this.opts.fontSize;
  }

  get font(): string {
    return `bold ${this.fontSize}px/1.1 SimHei, "Microsoft JhengHei", Arial, Helvetica, sans-serif`;
  }

  get width(): number {
    return this.player.rect.width;
  }

  get height(): number {
    return this.player.rect.height;
  }

  private run = (): void => {
    this.resizeCanvas();
    this.resizeTunnelHeight();
    this.resizeTunnel();
    this.start();
  };

  private onLoadedMetadata = (): void => {
    this.resizeCanvas();
    this.resizeTunnel();
  };

  private onResize = (): void => {
    this.resizeCanvas();
    this.resizeTunnel();
  };

  private onTimeUpdate = (): void => {
    const items = this.loadDanmaku();
    if (items) {
      for (let i = 0, l = items.length; i < l; i++) {
        if (!this.fill(items[i], i)) break;
      }
    }
  };

  private stop = (): void => {
    this.running = false;
    cancelAnimationFrame(this.timer);
  };

  private start = (): void => {
    if (this.running || !this.opts.on) return;
    this.running = true;
    this.initCanvas();
    this.update();
  };

  private initCanvas(): void {
    this.ctx.font = this.font;
    this.ctx.textAlign = 'left';
    this.ctx.textBaseline = 'top';
    this.ctx.shadowBlur = 2;
    this.ctx.shadowColor = '#000';
    this.ctx.shadowOffsetX = 1;
    this.ctx.shadowOffsetY = 1;
    this.ctx.globalAlpha = this.opts.opacity;
  }

  private resizeCanvas(): void {
    const ratio = window.devicePixelRatio || 2;
    this.dom.width = this.width * ratio;
    this.dom.height = this.height * ratio;
    this.ctx.scale(ratio, ratio);
  }

  private resizeTunnel(): void {
    this.tunnel = ((this.height * this.opts.area) / this.tunnelHeight) | 0;
  }

  private resizeTunnelHeight(): void {
    const text = RPlayer.utils.htmlDom('昊', 'span');
    text.style.font = this.font;
    text.style.position = 'absolute';
    text.style.opacity = '0';
    document.body.appendChild(text);
    const height = text.scrollHeight;
    document.body.removeChild(text);
    this.tunnelHeight = height + 1;
  }

  private getPersistOpts(opts = this.opts): DanmakuOptions {
    const {
      on,
      blockTypes,
      opacity,
      area,
      speed,
      fontSize,
      unlimited,
      bottomUp,
      merge,
      color,
      type,
    } = opts;

    return {
      on,
      blockTypes: [...blockTypes],
      opacity,
      area,
      speed,
      fontSize,
      unlimited,
      bottomUp,
      merge,
      color,
      type,
    };
  }

  private setDefaultOptions(opts: DanmakuOptions): void {
    this.DEFAULT_SETTING = this.getPersistOpts(opts);
  }

  private restoreSetting(): void {
    if (this.player) {
      const setting = this.player.storage.get('danmaku', {});
      this.opts = RPlayer.utils.extend(this.opts, setting);
    }
  }

  persistSetting(): void {
    if (!this.player) return;
    this.player.storage.set({ danmaku: this.getPersistOpts() });
  }

  private onPlayerSeeked = (): void => {
    this.clear();
    this.remain = [...this.opts.items];
  };

  private update = (): void => {
    this.draw();
    this.timer = requestAnimationFrame(this.update);
  };

  private draw(): void {
    this.ctx.clearRect(0, 0, this.dom.width, this.dom.height);
    this.bullets.forEach((bullet) => bullet.display());
    this.clearBullets();
  }

  private recycleBullet(b: Bullet): void {
    if (this.pool.length < 20) {
      this.pool.push(b.recycle());
    }
  }

  private clearBullets(): void {
    const bullets: Bullet[] = [];
    this.bullets.forEach((b) => {
      if (b.canRecycle) {
        this.recycleBullet(b);
      } else {
        bullets.push(b);
      }
    });
    this.bullets = bullets;

    for (let i = 0; i < this.tunnel; i++) {
      if (this.scroll[i] && this.scroll[i].canRecycle) {
        this.scroll[i] = undefined;
      }
      if (this.top[i] && this.top[i].canRecycle) this.top[i] = undefined;
      if (this.bottom[i] && this.bottom[i].canRecycle) {
        this.bottom[i] = undefined;
      }
    }
  }

  private getBullet(item: Item, tunnel: number, prevBullet?: Bullet): Bullet {
    const bullet = this.pool.pop();
    if (bullet) return bullet.reset(item, tunnel, prevBullet);
    return new Bullet(this, item, tunnel, prevBullet);
  }

  private getShortestTunnel(): [number, Bullet] {
    let length = Infinity;
    let tunnel = -1;
    let bullet: Bullet = null;
    for (let i = 0; i < this.tunnel; i++) {
      if (!this.scroll[i] || this.scroll[i].canRecycle) return [i, null];
      const l = this.scroll[i].length;
      if (l < length) {
        length = l;
        tunnel = i;
        bullet = this.scroll[i];
      }
    }
    return [tunnel, bullet];
  }

  private fill(item: Item, i = 0, force = false): boolean {
    if (item.type === 'top' || item.type === 'bottom') {
      let tunnel = -1;
      for (let i = 0; i < this.tunnel; i++) {
        if (!this[item.type][i] || this[item.type][i].canRecycle) {
          tunnel = i;
          break;
        }
      }
      if (tunnel > -1) {
        this[item.type][tunnel] = this.getBullet(item, tunnel);
        this.bullets.push(this[item.type][tunnel]);
        item = undefined;
      }
    } else {
      const [tunnel, prevBullet] = this.getShortestTunnel();
      if (!prevBullet || prevBullet.length < this.width + 200) {
        this.scroll[tunnel] = this.getBullet(item, tunnel, prevBullet);
        this.bullets.push(this.scroll[tunnel]);
        item = undefined;
      }
    }

    if (!item) return true;

    if (this.opts.unlimited || force) {
      this.scroll.push(this.getBullet(item, i % this.tunnel));
      return true;
    }
    return false;
  }

  on(): void {
    this.opts.on = true;
    this.remain = [...this.opts.items];
    this.start();
  }

  off(): void {
    this.opts.on = false;
    this.stop();
    this.clear();
    this.ctx.clearRect(0, 0, this.dom.width, this.dom.height);
  }

  toggle(): void {
    if (this.opts.on) {
      this.off();
    } else {
      this.on();
    }
  }

  updateSetting(): void {
    this.updateBlockTypes();
    this.updateOpacity();
    this.updateArea();
    this.updateSpeed();
    this.updateFontSize();
    this.updateUnlimited();
    this.updateBottomUp();
    this.updateMerge();
  }

  private isAllowedType(item: Item, types = this.opts.blockTypes): boolean {
    if (types.includes(item.type)) return false;
    if (types.includes('scroll') && !item.type) return false;
    if (types.includes('color') && item.color) return false;
    return true;
  }

  updateBlockTypes(types = this.opts.blockTypes): void {
    this.opts.blockTypes = types;
    if (!types.length) {
      this.bullets.forEach((x) => x.show());
    } else {
      this.bullets.forEach((d) => {
        if (this.isAllowedType(d.item, types)) {
          d.show();
        } else {
          d.hide();
        }
      });
    }

    this.persistSetting();
  }

  updateOpacity(opacity = this.opts.opacity): void {
    this.ctx.globalAlpha = opacity;
    this.persistSetting();
  }

  updateArea(area = this.opts.area): void {
    this.opts.area = area;
    this.resizeTunnel();
    this.persistSetting();
  }

  updateSpeed(speed = this.opts.speed): void {
    this.opts.speed = speed;
    this.bullets.forEach((x) => x.updateActualSpeed());
    this.persistSetting();
  }

  updateFontSize(fontSize = this.opts.fontSize): void {
    this.opts.fontSize = fontSize;
    this.resizeTunnelHeight();
    this.resizeTunnel();
    this.ctx.font = this.font;
    this.bullets.forEach((x) => x.updateY());
    this.persistSetting();
  }

  updateUnlimited(unlimited = this.opts.unlimited): void {
    this.opts.unlimited = unlimited;
    this.persistSetting();
  }

  updateBottomUp(bottomUp = this.opts.bottomUp): void {
    this.opts.bottomUp = bottomUp;
    this.bullets.forEach((x) => x.updateY());
    this.persistSetting();
  }

  updateMerge(merge = this.opts.merge): void {
    this.opts.merge = merge;
    this.persistSetting();
  }

  resetSetting(): void {
    this.opts = { ...this.opts, ...this.defaultSetting };
    this.updateSetting();
  }

  clear(): void {
    this.bullets.forEach((b) => this.recycleBullet(b));
    this.bullets = [];
    this.scroll = [];
    this.top = [];
    this.bottom = [];
  }

  send(item: Item): void {
    this.opts.items.push(item);
    this.fill(item, 0, true);
  }

  resetItems(item: Item[] = []): void {
    this.opts.items = item;
    this.remain = [...item];
    this.update();
  }

  push(item: Item[] | Item): void {
    if (!item) return;

    if (Array.isArray(item)) {
      this.opts.items.push(...item);
      this.remain.push(...item);
    } else {
      this.opts.items.push(item);
      this.remain.push(item);
    }

    this.update();
  }

  private loadDanmaku(): void | Item[] {
    if (!this.remain.length) return;

    const time = this.player.currentTime | 0;
    if (this.prevCurrentTime === time) return;
    this.prevCurrentTime = time;

    const remain: Item[] = [];
    let toShow: Item[] = [];
    const blockTypes = this.opts.blockTypes;

    for (let i = 0, l = this.remain.length; i < l; i++) {
      const item = this.remain[i];
      if (!item || !item.text) continue;
      if (item.time === time) {
        if (
          blockTypes.length &&
          (blockTypes.includes(item.type) ||
            (!item.type && blockTypes.includes('scroll')) ||
            (blockTypes.includes('color') && !item.color))
        ) {
          continue;
        }
        toShow.push(item);
      } else if (item.time > time) {
        remain.push(item);
      }
    }

    this.remain = remain;
    if (!toShow.length) return;

    if (this.opts.merge) {
      const group: Record<string, Item> = {};
      toShow.forEach((x) => {
        group[x.text] = x;
      });
      toShow = Object.keys(group).reduce((a, c) => {
        a.push(group[c]);
        return a;
      }, []);
    }

    return toShow;
  }
}
