import RPlayer from 'rplayer';
import processOpts, { Item, DanmakuOpts } from './options';
import Dan from './dan';

export default class Danmaku {
  readonly dom: HTMLElement;
  readonly opts: DanmakuOpts;
  player: RPlayer;
  private tunnel = 0;
  fontSize: number;
  private opacity = 1;
  tunnelHeight = 0;
  private area: number;
  private unlimited = false;
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

  constructor(opts: DanmakuOpts) {
    this.dom = RPlayer.utils.newElement('rplayer_dan');
    this.opts = processOpts(opts);

    const items = this.opts.items;
    this.opts.items = [];
    this.push(items);

    this.updateOpacity(this.opts.opacity);
    this.updateArea(this.opts.area);
    this.updateFontSize(this.opts.fontSize);
  }

  install(player: RPlayer): void {
    this.player = player;
    this.player.appendChild(this.dom);

    player.on(RPlayer.Events.PAUSE, this.pause);
    player.on(RPlayer.Events.LOADING_SHOW, this.pause);
    player.on(RPlayer.Events.LOADING_HIDE, this.update);
    player.on(RPlayer.Events.PLAY, this.update);
    player.on(RPlayer.Events.ENDED, this.pause);
    player.on(RPlayer.Events.PLAYER_RESIZE, this.updateTunnel);
    player.on(RPlayer.Events.SEEKED, this.onPlayerSeeked);

    if (document.contains(this.player.dom)) {
      this.run();
    } else {
      player.once(RPlayer.Events.MOUNTED, this.run);
    }
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

    this.tunnel = ((this.area * h) / this.tunnelHeight) | 0;

    const maxLen = Math.max(
      this.last.length,
      this.top.length,
      this.bottom.length
    );

    if (maxLen > this.tunnel) {
      for (let i = this.tunnel; i < maxLen; i++) {
        this.recycleDan(this.last[i]);
        this.recycleDan(this.top[i]);
        this.recycleDan(this.bottom[i]);
        this.last[i] = undefined;
        this.top[i] = undefined;
        this.bottom[i] = undefined;
      }
    }

    this.current.forEach((item) => item.updateVertical());

    if (this.tunnel < 1) {
      this.hide();
    } else {
      this.show();
    }
  };

  updateArea(area: number): void {
    if (!RPlayer.utils.isNum(area)) return;
    this.unlimited = area > 1;
    this.area = RPlayer.utils.clamp(area);
    this.updateTunnel();
  }

  updateOpacity(opacity: number): void {
    if (!RPlayer.utils.isNum(opacity)) return;
    this.opacity = RPlayer.utils.clamp(opacity);
    this.dom.style.opacity = this.opacity.toString();
  }

  updateFontSize(fontSize: number): void {
    if (!RPlayer.utils.isNum(fontSize)) {
      this.fontSize = this.getFontSize();
    } else {
      this.fontSize = fontSize;
    }
    if (!this.tunnelHeight) this.tunnelHeight = this.fontSize;
    this.updateTunnel();
    this.dom.style.fontSize = this.fontSize + 'px';
  }

  updateScrollFrame(scrollFrame?: number): void {
    if (scrollFrame) this.opts.scrollFrame = scrollFrame;
  }

  updateStaticFrame(staticFrame?: number): void {
    if (staticFrame) this.opts.staticFrame = staticFrame;
  }

  private getFontSize(): number {
    const [w] = RPlayer.utils.getClientWH();
    if (w < 769) return 15;
    return 23;
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

  toggleBlockType(type: string): void {
    if (!type) return;
    if (this.opts.blockTypes.includes(type as any)) {
      this.opts.blockTypes = this.opts.blockTypes.filter((x) => x !== type);
      this.remain = this.opts.items;
    } else {
      this.opts.blockTypes.push(type as any);
      this.remain = this.remain.filter((x) => x.type !== type);
      this.current = this.current.filter((x) => {
        if (x.type === type) {
          this.recycleDan(x);
          return false;
        }

        return true;
      });
    }
  }

  send(item: Item): void {
    item.isMe = true;
    this.opts.items.push(item);
    this.insert(item, 0, true);
  }

  push(item: Item[] | Item): void {
    if (!item) return;

    if (Array.isArray(item)) {
      this.opts.items.push(...item);

      if (this.opts.blockTypes.length) {
        item = item.filter((x) => !this.opts.blockTypes.includes(x.type));
      }

      this.remain.push(...item);
    } else {
      this.opts.items.push(item);
      if (!this.opts.blockTypes.includes(item.type)) {
        this.remain.push(item);
      }
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

    if ((item && this.unlimited) || force) {
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
    const toShow: Item[] = [];

    this.remain.forEach((x) => {
      if (x.time === time) {
        toShow.push(x);
      } else {
        remain.push(x);
      }
    });

    this.remain = remain;
    if (!toShow.length) return;

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
    if (this.running) return;
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
    this.updateTunnel();
    this.show();
    if (!this.player.playing) this.pause();
  };
}
