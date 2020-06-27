import RPlayer from 'rplayer';
import processOpts, { Item, DanmakuOptions } from './options';
import Dan from './dan';
import UI from './ui';

export default class Danmaku {
  private DEFAULT_SETTING: DanmakuOptions;
  ui: UI;
  readonly dom: HTMLElement;
  opts: DanmakuOptions;
  player: RPlayer;
  tunnel = 0;
  tunnelHeight = 0;
  private showing = false;
  private running = false;
  private timer: number;
  private remain: Item[] = [];
  private current: Dan[] = [];
  private last: Dan[] = [];
  private pool: Dan[] = [];
  private top: Dan[] = [];
  private bottom: Dan[] = [];
  private prevCurrentTime = 0;

  constructor(opts: DanmakuOptions) {
    this.dom = RPlayer.utils.newElement('rplayer_dan');
    this.opts = processOpts(opts);
    this.setDefaultOptions(this.opts);
    this.remain = this.opts.items;
  }

  install(player: RPlayer): void {
    this.player = player;
    this.restoreSetting();

    this.player.appendChild(this.dom);

    player.on(RPlayer.Events.PAUSE, this.pause);
    player.on(RPlayer.Events.LOADING_SHOW, this.pause);
    player.on(RPlayer.Events.LOADING_HIDE, this.update);
    player.on(RPlayer.Events.PLAY, this.update);
    player.on(RPlayer.Events.ENDED, this.pause);
    player.on(RPlayer.Events.PLAYER_RESIZE, this.updateTunnel);
    player.on(RPlayer.Events.SEEKED, this.onPlayerSeeked);

    this.updateSetting();

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

  private setDefaultOptions(opts: DanmakuOptions): void {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { items, on, staticFrame, scrollFrame, baseFontSize, ...rest } = opts;
    rest.blockTypes = [...rest.blockTypes];
    this.DEFAULT_SETTING = rest;
  }

  private getFontSize(): number {
    const [w] = RPlayer.utils.getClientWH();
    if (w < 769) return 15;
    return 23;
  }

  private restoreSetting(): void {
    if (this.player) {
      const setting = this.player.storage.get('danmaku', {});
      this.opts = RPlayer.utils.extend(this.opts, setting);
    }

    this.opts.baseFontSize = this.opts.baseFontSize || this.getFontSize();
    this.tunnelHeight = this.tunnelHeight || this.fontSize + 1;
  }

  private persistSetting(): void {
    if (!this.player) return;
    // eslint-disable-next-line prettier/prettier, @typescript-eslint/no-unused-vars
    const { items, on, staticFrame, scrollFrame, baseFontSize, ...r } = this.opts;
    this.player.storage.set({ danmaku: r });
  }

  private onPlayerSeeked = (): void => {
    this.clear();
    this.remain = this.opts.items;
  };

  updateTunnelHeight(h: number): void {
    if (h && this.tunnelHeight < h) {
      this.tunnelHeight = h;
      this.updateTunnel();
    }
  }

  private updateTunnel = (): void => {
    if (!this.player) return;

    const h = this.player.rect.height;
    if (!h) return;

    this.tunnel = ((this.opts.area * h) / this.tunnelHeight) | 0;

    if (this.tunnel < 1) {
      this.hide();
    } else {
      this.current.forEach((item) => item.updateVertical());
      this.show();
    }
  };

  on(): void {
    this.opts.on = true;
    this.run();
  }

  off(): void {
    this.opts.on = false;
    this.hide();
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

  private isAllowedType(
    item: { type: any; color: string },
    types = this.opts.blockTypes
  ): boolean {
    if (types.includes(item.type)) return false;
    if (types.includes('scroll') && !item.type) return false;
    if (types.includes('color') && item.color) return false;
    return true;
  }

  updateBlockTypes(types = this.opts.blockTypes): void {
    this.opts.blockTypes = types;
    if (!types.length) {
      this.current.forEach((x) => x.visible());
    } else {
      this.current.forEach((d) => {
        if (this.isAllowedType(d, types)) {
          d.visible();
        } else {
          d.invisible();
        }
      });
    }

    this.persistSetting();
  }

  updateOpacity(opacity = this.opts.opacity): void {
    this.dom.style.opacity = opacity.toString();
    this.persistSetting();
  }

  updateArea(area = this.opts.area): void {
    this.opts.area = area;
    this.updateTunnel();
    this.persistSetting();
  }

  updateSpeed(speed = this.opts.speed): void {
    this.opts.speed = speed;
    this.current.forEach((x) => x.updateSpeed());
    this.persistSetting();
  }

  updateFontSize(fontSize = this.opts.fontSize): void {
    this.opts.fontSize = fontSize;
    this.dom.style.fontSize = this.fontSize + 'px';
    this.tunnelHeight = this.fontSize + 1;
    this.updateTunnel();
    this.persistSetting();
  }

  updateUnlimited(unlimited = this.opts.unlimited): void {
    this.opts.unlimited = unlimited;
    this.persistSetting();
  }

  updateBottomUp(bottomUp = this.opts.bottomUp): void {
    this.opts.bottomUp = bottomUp;
    this.current.forEach((x) => x.updateVertical());
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

  hide(): void {
    this.showing = false;
    this.pause();
    this.clear();
  }

  show(): void {
    if (this.showing) return;
    this.showing = true;
    this.pause();
    this.update();
  }

  clear(): void {
    this.current.forEach((dan) => this.recycleDan(dan));
    this.current = [];
    this.last = [];
    this.top = [];
    this.bottom = [];
  }

  send(item: Item): void {
    this.show();
    this.opts.items.push(item);
    this.insert(item, 0, true);
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
  }

  private getDan(
    item: Item,
    tunnel: number,
    length?: number,
    speed?: number
  ): Dan {
    const dan = this.pool.pop();
    if (dan) return dan.reset(item, tunnel, length, speed);
    return new Dan(this, item, tunnel, length, speed);
  }

  private recycleDan(dan: Dan): void {
    if (!dan) return;
    if (this.pool.length > 20) {
      dan.destroy();
    } else {
      dan.recycle();
      this.pool.push(dan);
    }
  }

  private pause = (): void => {
    cancelAnimationFrame(this.timer);
    this.running = false;
  };

  private getShortestTunnel(): [number, number, number] {
    let length = Infinity;
    let tunnel = -1;
    let speed = 0;
    for (let i = 0; i < this.tunnel; i++) {
      if (!this.last[i] || this.last[i].canRecycle) return [i, 0, 0];
      const l = this.last[i].invisibleLength;
      if (l < length) {
        length = l;
        tunnel = i;
        speed = this.last[i].speed;
      }
    }
    return [tunnel, length, speed];
  }

  private insert(item: Item, i = 0, force = false): void {
    if (!item) return;
    if (item.type === 'top' || item.type === 'bottom') {
      let tunnel = -1;
      for (let i = 0; i < this.tunnel; i++) {
        if (!this[item.type][i] || this[item.type][i].canRecycle) {
          tunnel = i;
          break;
        }
      }
      if (tunnel > -1) {
        this[item.type][tunnel] = this.getDan(item, tunnel);
        this.current.push(this[item.type][tunnel]);
        item = undefined;
      }
    } else {
      const [tunnel, length, speed] = this.getShortestTunnel();
      if (length < 200) {
        this.last[tunnel] = this.getDan(item, tunnel, length, speed);
        this.current.push(this.last[tunnel]);
        item = undefined;
      }
    }

    if ((item && this.opts.unlimited) || force) {
      this.current.push(this.getDan(item, i % this.tunnel, i));
    }
  }

  private load(): void {
    if (
      !this.showing ||
      !this.player ||
      !this.remain.length ||
      this.tunnel < 1
    ) {
      return;
    }

    const time = this.player.currentTime | 0;
    if (this.prevCurrentTime === time) return;
    this.prevCurrentTime = time;

    const remain: Item[] = [];
    let toShow: Item[] = [];

    this.remain.forEach((x) => {
      if (x.time === time) {
        const types = this.opts.blockTypes;
        if (
          types.length &&
          (types.includes(x.type) ||
            (!x.type && types.includes('scroll')) ||
            (types.includes('color') && x.color))
        ) {
          return;
        }
        toShow.push(x);
      } else if (x.time > time) {
        remain.push(x);
      }
    });

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

    for (let i = 0, l = toShow.length; i < l; i++) {
      const item = toShow[i];
      if (!item || !item.text) break;
      this.insert(item, i);
    }
  }

  private fire(): void {
    this.current.forEach((dan) => dan.update());
  }

  private clean(): void {
    const current: Dan[] = [];
    this.current.forEach((dan) => {
      if (dan.canRecycle) {
        this.recycleDan(dan);
      } else {
        current.push(dan);
      }
    });
    this.current = current;

    for (let i = 0; i < this.tunnel; i++) {
      if (this.last[i] && this.last[i].canRecycle) this.last[i] = undefined;
      if (this.top[i] && this.top[i].canRecycle) this.top[i] = undefined;
      if (this.bottom[i] && this.bottom[i].canRecycle) {
        this.bottom[i] = undefined;
      }
    }
  }

  private update = (): void => {
    if (this.running || !this.opts.on) return;
    this.running = true;
    this.render();
  };

  private render = (): void => {
    this.load();
    this.fire();
    this.clean();

    if (!this.current.length && !this.remain.length) return this.hide();
    this.timer = requestAnimationFrame(this.render);
  };

  private run = (): void => {
    if (!this.opts.on) return;
    this.updateTunnel();
    this.show();
    if (!this.player.playing) this.pause();
  };
}
