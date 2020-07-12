import RPlayer, { Plugin } from 'rplayer';
import processOpts, { Item, DanmakuOptions } from './options';
import Bullet from './bullet';
import UI from './ui';

export default class Danmaku implements Plugin {
  static readonly typeMap: Item['type'][] = ['scroll', 'top', 'bottom'];
  readonly dom: HTMLElement;
  private DEFAULT_SETTING: DanmakuOptions;
  private ui: UI;
  player: RPlayer;
  opts: DanmakuOptions;

  private prevTime = -1;
  tunnel = 0;
  tunnelHeight = 0;
  private items: { [key: number]: Item[] } = {};
  private sended: Item[] = [];
  private bullets: Bullet[] = [];
  private pool: Bullet[] = [];
  private scroll: Bullet[] = [];
  private top: Bullet[] = [];
  private bottom: Bullet[] = [];

  displaySeconds = 0;

  constructor(opts: DanmakuOptions) {
    this.dom = RPlayer.utils.newElement('rplayer_dan');
    this.opts = processOpts(opts);
    this.addItems(this.opts.items);
    this.setDefaultOptions(this.opts);
  }

  install(player: RPlayer): void {
    this.player = player;
    this.player.appendChild(this.dom);
    this.restoreSetting();
    this.updateSetting();

    player.on(RPlayer.Events.PAUSE, this.pause);
    player.on(RPlayer.Events.ENDED, this.pause);
    player.on(RPlayer.Events.PLAYER_RESIZE, this.onResize);
    player.on(RPlayer.Events.SEEKED, this.onSeeked);
    player.on(RPlayer.Events.LOADED_METADATA, this.init);

    this.ui = new UI(this);

    if (document.body.contains(player.dom)) {
      this.init();
    }
  }

  destroy(): void {
    if (this.ui) this.ui.destroy();

    if (this.player) {
      this.player.off(RPlayer.Events.PAUSE, this.pause);
      this.player.off(RPlayer.Events.ENDED, this.pause);
      this.player.off(RPlayer.Events.PLAYER_RESIZE, this.onResize);
      this.player.off(RPlayer.Events.SEEKED, this.onSeeked);
      this.player.off(RPlayer.Events.LOADED_METADATA, this.init);
      this.off();
      this.pool.forEach((b) => b.destroy());
    }

    if (this.dom.parentNode) {
      this.dom.parentNode.removeChild(this.dom);
    }
  }

  get width(): number {
    return this.player.rect.width;
  }

  get height(): number {
    return this.player.rect.height;
  }

  get fontSize(): number {
    return this.opts.baseFontSize * this.opts.fontSize;
  }

  get defaultSetting(): DanmakuOptions {
    const setting = { ...this.DEFAULT_SETTING };
    setting.blockTypes = [...setting.blockTypes];
    return setting;
  }

  private init = (): void => {
    this.updateDisplaySeconds();
    this.updateTunnelHeight();
    this.updateTunnel();
    this.ui.updatePopoverUI();

    this.on();
  };

  private onTimeUpdate = (): void => {
    if (this.player.paused) return;
    const time = this.player.currentTime;
    const items = this.load(time);
    if (!items && !this.bullets.length) return;

    if (items) {
      for (let i = 0, l = items.length; i < l; i++) {
        if (!this.insert(items[i], time, i)) break;
      }
    }

    const bullets: Bullet[] = [];
    let bullet: Bullet;
    for (let i = 0, l = this.bullets.length; i < l; i++) {
      bullet = this.bullets[i];
      if (bullet.update(time)) {
        this.recycleBullet(bullet);
      } else {
        bullets.push(bullet);
      }
    }
    this.bullets = bullets;
  };

  private load(time: number): void | Item[] {
    time = time | 0;
    if (time === this.prevTime) return;
    this.prevTime = time;
    if (!this.items[time]) return;

    let toShow = this.items[time];
    const blockTypes = this.opts.blockTypes;

    if (blockTypes.length) {
      toShow = toShow.filter(
        (x) =>
          !(
            blockTypes.indexOf(x.type) > -1 ||
            (!x.type && blockTypes.indexOf('scroll') > -1) ||
            (x.color && blockTypes.indexOf('color') > -1)
          )
      );
    }

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

  private getShortestTunnel(): [number, Bullet] {
    let time = Infinity;
    let tunnel = -1;
    let bullet: Bullet = null;
    for (let i = 0; i < this.tunnel; i++) {
      if (!this.scroll[i] || this.scroll[i].canRecycle) return [i, null];
      const showTime = this.scroll[i].showTime;
      if (showTime < time) {
        time = showTime;
        tunnel = i;
        bullet = this.scroll[i];
      }
    }
    return [tunnel, bullet];
  }

  private getStaticEmptyTunnel(name: 'top' | 'bottom'): number {
    let tunnel = -1;
    for (let i = 0; i < this.tunnel; i++) {
      if (!this[name][i] || this[name][i].canRecycle) {
        tunnel = i;
        break;
      }
    }
    return tunnel;
  }

  private insert(item: Item, time: number, i = 0, force?: boolean): boolean {
    if (item.type === 'top' || item.type === 'bottom') {
      const tunnel = this.getStaticEmptyTunnel(item.type);
      if (tunnel > -1) {
        this[item.type][tunnel] = this.getBullet(item, tunnel, time);
        this.bullets.push(this[item.type][tunnel]);
        item = undefined;
      }
    } else {
      const [tunnel, prevBullet] = this.getShortestTunnel();
      if (!prevBullet || prevBullet.showTime <= time + 2) {
        this.scroll[tunnel] = this.getBullet(item, tunnel, time, prevBullet);
        this.bullets.push(this.scroll[tunnel]);
        item = undefined;
      }
    }

    if (!item) return true;
    if (this.opts.unlimited || force) {
      this.bullets.push(this.getBullet(item, i % this.tunnel, time));
      return true;
    }
    return false;
  }

  private getBullet(
    item: Item,
    tunnel: number,
    time: number,
    prevBullet?: Bullet
  ): Bullet {
    const bullet = this.pool.pop();
    if (bullet) return bullet.reset(item, tunnel, time, prevBullet);
    return new Bullet(this, item, tunnel, time, prevBullet);
  }

  private recycleBullet(b: Bullet): void {
    if (this.pool.length < 30) {
      this.pool.push(b.recycle());
    } else {
      b.destroy();
    }
  }

  private clear(): void {
    this.bullets.forEach((b) => this.recycleBullet(b));
    this.bullets = [];
    this.scroll = [];
    this.top = [];
    this.bottom = [];
    this.addItems(this.sended);
    this.sended = [];
  }

  private restoreSetting(): void {
    if (this.player) {
      const setting = this.player.storage.get('danmaku', {});
      this.opts = RPlayer.utils.extend(this.opts, setting);
    }
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

  private onResize = (): void => {
    this.updateTunnelHeight();
    this.updateTunnel();
    this.updateDisplaySeconds();
  };

  private onSeeked = (): void => {
    this.clear();
    this.prevTime = -1;
  };

  persistSetting(): void {
    if (!this.player) return;
    this.player.storage.set({ danmaku: this.getPersistOpts() });
  }

  resetSetting(): void {
    this.opts = { ...this.opts, ...this.defaultSetting };
    this.updateSetting();
  }

  on(): void {
    this.off();
    this.player.on(RPlayer.Events.TIME_UPDATE, this.onTimeUpdate);
    this.opts.on = true;
  }

  off(): void {
    this.player.off(RPlayer.Events.TIME_UPDATE, this.onTimeUpdate);
    this.clear();
    this.opts.on = false;
  }

  toggle(): void {
    if (this.opts.on) {
      this.off();
    } else {
      this.on();
    }
  }

  pause = (): void => {
    const time = this.player.currentTime;
    this.bullets.forEach((b) => b.pause(time));
  };

  addItem(v: Item): void {
    if (!v || !v.text) return;
    this.items[v.time] = this.items[v.time] || [];
    this.items[v.time].push(v);
  }

  addItems(v: Item | Item[]): void {
    if (Array.isArray(v)) {
      v.forEach((x) => this.addItem(x));
    } else {
      this.addItem(v);
    }
  }

  resetItems(v?: Item[] | Item): void {
    this.items = {};
    this.addItems(v);
  }

  send(v: Item): void {
    if (!v || !v.text) return;
    v.time = v.time || Math.round(this.player.currentTime | 0);
    this.insert(v, v.time, 0, true);
    this.sended.push(v);
  }

  updateTunnelHeight(): void {
    const div = RPlayer.utils.newElement('rplayer_dan_d');
    div.innerText = '字';
    this.dom.appendChild(div);
    const h = div.scrollHeight;
    if (h) this.tunnelHeight = div.offsetHeight + 2;
    this.dom.removeChild(div);
  }

  updateTunnel(): void {
    this.tunnel = ((this.height * this.opts.area) / this.tunnelHeight) | 0;
  }

  updateDisplaySeconds(): void {
    this.displaySeconds = this.width / 128;
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

  updateOpacity(opacity = this.opts.opacity): void {
    this.dom.style.opacity = String(opacity);
    this.persistSetting();
  }

  updateSpeed(speed = this.opts.speed): void {
    this.opts.speed = speed;
    this.persistSetting();
  }

  updateFontSize(fontSize = this.opts.fontSize): void {
    this.opts.fontSize = fontSize;
    this.dom.style.fontSize = this.fontSize + 'px';
    this.updateTunnelHeight();
    this.updateTunnel();
    this.bullets.forEach((x) => x.updateTop());
    this.persistSetting();
  }

  updateArea(area = this.opts.area): void {
    this.opts.area = area;
    this.updateTunnel();
    this.bullets.forEach((b) => b.updateTop());
    this.persistSetting();
  }

  updateMerge(merge = this.opts.merge): void {
    this.opts.merge = merge;
    this.persistSetting();
  }

  updateUnlimited(unlimited = this.opts.unlimited): void {
    this.opts.unlimited = unlimited;
    this.persistSetting();
  }

  updateBottomUp(bottomUp = this.opts.bottomUp): void {
    this.opts.bottomUp = bottomUp;
    this.bullets.forEach((x) => x.updateTop());
    this.persistSetting();
  }

  private isAllowedType(item: Item, types = this.opts.blockTypes): boolean {
    if (types.indexOf(item.type) > -1) return false;
    if (types.indexOf('scroll') > -1 && !item.type) return false;
    if (types.indexOf('color') > -1 && item.color) return false;
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
}
