import { Tooltip } from '../../components';
import type { PlayerBase } from '../../player-base';
import type { ControlItem, ProgressConfig } from '../../types';
import {
  $, addDestroyable, addDestroyableListener, clamp, Component, Drag, formatTime, isNumber, Rect, svgNS, throttle,
} from '../../utils';
import './index.scss';

const heatPoints = [
  9592,
  9692,
  10063,
  41138,
  30485,
  23905,
  10966.5,
  10316.5,
  8533.5,
  7249,
  7181,
  6813,
  5929,
  18046.5,
  8817,
  3684.5,
  4863.5,
  7818,
  11122,
  11977.5,
  12045.5,
  6882,
  8616,
  3389.5,
  2791.5,
  2378,
  2415,
  3561.5,
  4563.5,
  5351,
  5166,
  3649.5,
  3817.5,
  6808,
  3503,
  2831.5,
  2617.5,
  2401,
  2149,
  2478.5,
  2498.5,
  2311.5,
  1843.5,
  1800,
  2101,
  2002.5,
  2882.5,
  3380,
  3880,
  3966,
  3257,
  8804,
  5440,
  6468,
  6432,
  3885,
  3611,
  7348,
  11954,
  12317,
  5834,
  1549.5,
  1658.5,
  1649,
  2053,
  3831.5,
  6050.5,
  7764,
  8290,
  8549,
  5757,
  1898,
  1393,
  1263.5,
  1356.5,
  2841,
  5774,
  4294,
  1798,
  1260.5,
];

class Thumbnail extends Component {
  private opts: Required<Required<ProgressConfig>['thumbnail']> = {
    start: 0,
    gap: 10,
    col: 5,
    row: 5,
    width: 160,
    height: 90,
    images: ['https://nplayer.js.org/assets/images/M1-cce8ec398d0d5cd02d47cb8655f16125.jpg'],
  };

  private imgEl: HTMLElement;

  private timeEl: HTMLElement;

  private titleEl: HTMLElement;

  private rect: Rect;

  private thumbImgPrePic?: number;

  private ssGapRatio?: number;

  private chapters?: Chapter[];

  private markers?: ProgressConfig['markers'];

  constructor(
    container: HTMLElement,
    private prog: Progress,
  ) {
    super(container, '.prog_thumb');

    this.imgEl = this.el.appendChild($('.prog_thumb_img'));
    this.titleEl = this.el.appendChild($('.prog_thumb_title'));
    this.timeEl = this.el.appendChild($('.prog_thumb_time'));
    this.rect = addDestroyable(this, new Rect(this.el));

    this.updateOptions();
  }

  updateOptions() {
    const cfg = this.prog.config;
    const opts = Object.assign(this.opts, cfg?.thumbnail);

    if (opts.images.length) {
      this.imgEl.style.display = 'block';
      this.titleEl.style.width = this.imgEl.style.width = `${opts.width}px`;
      this.imgEl.style.height = `${opts.height}px`;
      this.thumbImgPrePic = opts.col * opts.row;
      this.ssGapRatio = opts.start / opts.gap;
    } else {
      this.imgEl.style.display = 'none';
    }
    const chapters = this.prog.chapters;
    const markers = cfg?.markers;
    if (chapters && chapters.length) this.chapters = chapters;
    if (markers && markers.length) this.markers = markers;
  }

  update(time: number, x: number, maxX: number) {
    if (this.opts.images.length) {
      const thumb = this.getCurrentThumb(time);
      if (thumb) {
        this.imgEl.style.backgroundImage = `url(${thumb.url})`;
        this.imgEl.style.backgroundPosition = `-${thumb.x}px -${thumb.y}px`;
      }
    } else {
      this.rect.update();
    }
    this.timeEl.textContent = formatTime(time);

    let title;
    if (this.markers) {
      for (let i = 0, l = this.markers.length, item; i < l; i++) {
        item = this.markers[i];
        if (time >= item.time && time < (item.time + 2)) {
          title = item.title;
          break;
        }
      }
    }
    if (!title && this.chapters) {
      for (let i = 0, l = this.chapters.length, item; i < l; i++) {
        item = this.chapters[i];
        if (time >= item.start && time <= item.end) {
          title = item.title;
          break;
        }
      }
    }

    if (title) this.titleEl.textContent = title;
    const half = this.rect.width / 2;
    this.el.style.left = `${clamp(x - half, 0, Math.max(0, maxX - 2 * half))}px`;
  }

  private getCurrentThumb(time: number) {
    const i = Math.max(time / this.opts.gap - this.ssGapRatio!, 0) | 0;
    const url = this.opts.images[(i / this.thumbImgPrePic!) | 0];
    if (!url) return;
    const x = (i % this.opts.col) * this.opts.width;
    const y = ~~((i % this.thumbImgPrePic!) / this.opts.row) * this.opts.height;
    return { url, x, y };
  }
}

class Chapter extends Component {
  duration: number;

  private bufferedEl: HTMLElement;

  private playedEl: HTMLElement;

  private hoverEl: HTMLElement;

  constructor(container: HTMLElement | DocumentFragment, public start: number, public end: number, public title?: string) {
    super(container, '.prog_chapter_i');
    this.duration = end - start;
    const wrapEl = this.el.appendChild($('.prog_chapter_i_w'));
    this.bufferedEl = wrapEl.appendChild($('.prog_chapter_i_b'));
    this.hoverEl = wrapEl.appendChild($('.prog_chapter_i_h'));
    this.playedEl = wrapEl.appendChild($('.prog_chapter_i_p'));
  }

  private setBar(time: number, dom: HTMLElement) {
    const match = this.match(time);
    dom.style.transform = `scaleX(${
      match ? ((time - this.start) / this.duration) : time > this.end ? 1 : 0
    })`;
    return match;
  }

  match(time: number) {
    return time >= this.start && time <= this.end;
  }

  updateHover(time: number) {
    return this.setBar(time, this.hoverEl);
  }

  updateBuffer(time: number) {
    return this.setBar(time, this.bufferedEl);
  }

  updatePlayed(time: number) {
    return this.setBar(time, this.playedEl);
  }
}

class Maker extends Component {
  time: number;

  dot: HTMLElement;

  constructor(container: HTMLElement, cfg: Required<ProgressConfig>['markers'][0], duration: number) {
    super(container, '.prog_marker_i');

    if (cfg.title) {
      new Tooltip(this.el, cfg.title);
    }

    this.dot = this.el.appendChild($('.prog_marker_i_d'));

    if (cfg.image) {
      const img = new Image(cfg.size?.[0], cfg.size?.[1]);
      img.src = cfg.image;
      this.el.appendChild(img);
    } else if (cfg.el) {
      if (cfg.size && cfg.size.length > 1) {
        cfg.el.style.width = `${cfg.size[0]}px`;
        cfg.el.style.height = `${cfg.size[1]}px`;
      }
      this.el.appendChild(cfg.el);
    }

    this.time = cfg.time;
    this.update(duration);
  }

  update(duration: number) {
    if (duration) {
      this.el.style.left = `${this.time / duration * 100}%`;
    }
  }
}

let heatId = 0;

class HeatMap extends Component {
  pathEl: SVGPathElement;

  constructor(
    container: HTMLElement,
    dots: number[][],
    max: number,
    flex?: string,
  ) {
    super(container, '.prog_heat_i');

    const d = this.update(dots, max);

    const svg = document.createElementNS(svgNS, 'svg');
    this.pathEl = document.createElementNS(svgNS, 'path');

    const defs = document.createElementNS(svgNS, 'defs');
    const clipPath = document.createElementNS(svgNS, 'clipPath');
    const rect = document.createElementNS(svgNS, 'rect');

    svg.setAttribute('viewBox', '0 0 1000 100');
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.setAttribute('width', '100%');
    clipPath.setAttribute('id', `np${heatId}`);
    this.pathEl.setAttributeNS(null, 'd', d);
    rect.setAttribute('clip-path', `url(#np${heatId})`);
    rect.setAttribute('fill', 'white');
    rect.setAttribute('fill-opacity', '0.2');
    rect.setAttribute('width', '100%');
    rect.setAttribute('height', '100%');
    rect.setAttribute('x', '0');
    rect.setAttribute('y', '0');

    clipPath.appendChild(this.pathEl);
    defs.appendChild(clipPath);
    svg.appendChild(defs);
    svg.appendChild(rect);

    heatId++;

    if (flex) {
      this.el.style.flex = flex;
    }

    this.el.appendChild(svg);
  }

  update(dots: number[][], max: number) {
    const path: string[] = ['M0 100'];
    let prev = [0, 100];
    let cur: number[] = [];
    let next: number[] | undefined;
    let dx1 = 0;
    let dy1 = 0;
    let dx2;
    let dy2;

    const getXY = (d?: number[]) => {
      if (!d) return;
      return [d[0], (1 - d[1] / max) * 100];
    };

    dots.forEach((d, i) => {
      cur = next || getXY(d)!;
      next = getXY(dots[i + 1]) || [1000, 100];

      const m = this.slope(prev, next);
      dx2 = (next[0] - cur[0]) * -0.3;
      dy2 = dx2 * m * 0.6;

      path.push(`C ${(prev[0] - dx1).toFixed(1)} ${(prev[1] - dy1).toFixed(1)}, ${
        (cur[0] + dx2).toFixed(1)} ${(cur[1] + dy2).toFixed(1)}, ${
        cur[0].toFixed(1)} ${cur[1].toFixed(1)}`);

      dx1 = dx2;
      dy1 = dy2;
      prev = cur;
    });

    path.push(`C ${(cur[0] - dx1).toFixed(1)} ${(cur[1] - dy1).toFixed(1)}, 1000 100, 1000 100`);
    return path.join(' ');
  }

  private slope(a: number[], b: number[]) {
    return (b[1] - a[1]) / (b[0] - a[0]);
  }
}

export class Progress extends Component implements ControlItem {
  id = 'progress';

  rect!: Rect;

  config?: ProgressConfig;

  private thumbnail!: Thumbnail;

  private duration = 0;

  private dotActive = false;

  private dragging = false;

  private player!: PlayerBase;

  private chapterEl!: HTMLElement;

  private markerEl!: HTMLElement;

  private heatEl!: HTMLElement;

  private dotEl!: HTMLElement;

  chapters: Chapter[] = [];

  private headMaps: HeatMap[] = [];

  constructor() {
    super(undefined, '.prog');
  }

  onInit(player: PlayerBase) {
    this.player = player;
    this.config = player.config?.control?.progress;

    this.heatEl = this.el.appendChild($('.prog_heat'));
    this.chapterEl = this.el.appendChild($('.prog_chapter'));
    this.markerEl = this.el.appendChild($('.prog_marker'));
    this.dotEl = this.el.appendChild($('.prog_dot'));
    this.dotEl.appendChild($('.prog_dot_i'));

    this.rect = addDestroyable(this, new Rect(this.el, player));
    addDestroyable(this, new Drag(this.el, this.onDragStart, this.onDragging, this.onDragEnd));
    addDestroyableListener(this, this.el, 'mousemove', throttle((ev: MouseEvent) => this.onMousemove(ev)), true);

    let duration = this.config?.duration || this.player.duration || 0;
    // eslint-disable-next-line no-restricted-globals
    if (isNaN(duration)) duration = 0;
    this.duration = duration;
    this.duration = duration = 600;
    this.setChapters(duration);
    this.setMarkers(duration);
    this.setHeatMap(duration);

    this.thumbnail = addDestroyable(this, new Thumbnail(this.el, this));
    this.thumbnail.updateOptions();
  }

  private onDragStart = (ev: PointerEvent) => {
    this.dragging = true;
    this.rect.update();
    this.onDragging(ev);
  }

  private onDragging = (ev: PointerEvent) => {
    const l = ev.clientX - this.rect.x;
    const t = this.getCurrentTime(l);
    this.updatePlayed(this.getCurrentTime(l));
    this.updateHover(l, t);
  }

  private onDragEnd = (ev: PointerEvent) => {
    this.dragging = false;
  }

  private onMousemove(ev: MouseEvent) {
    const l = ev.clientX - this.rect.x;
    const t = this.getCurrentTime(l);
    this.updateHover(l, t);
  }

  private updateHover(l: number, t: number) {
    const curTime = this.player.currentTime;
    this.chapters.forEach((c, i) => {
      if (c.updateHover(t)) {
        const h = this.headMaps[i];
        if (h) {
          h.el.style.transform = 'translateY(-1px)';
        }
        if (c.match(curTime) && !this.dotActive) {
          this.dotEl.style.transform = 'scale(1.2) translateY(-50%)';
          this.dotActive = true;
        }
      } else if (this.dotActive) {
        this.dotEl.style.transform = 'translateY(-50%)';
        this.dotActive = false;
      }
    });
    this.thumbnail.update(t, l, this.rect.width);
  }

  private updatePlayed(time: number) {
    this.chapters.forEach((c) => c.updatePlayed(time));
    this.dotEl.style.left = `${time / this.duration * 100}%`;
  }

  private getCurrentTime(left: number): number {
    return clamp((left / this.rect.width)) * this.duration;
  }

  private setChapters(duration: number) {
    this.config = {
      duration: 600,
      chapters: [{
        time: 100,
        title: 'title1',
      }, { time: 500, title: 'title2' },
      { title: 'title3' }],
    };
    const chapters = this.config?.chapters;

    if (chapters && chapters.length) {
      duration = chapters[chapters.length - 1].time || duration;
      if (!duration) return;
      const frag = document.createDocumentFragment();

      let prev = 0;
      chapters.forEach((c, i) => {
        const len = (c.time || duration) - prev;
        this.chapters[i] = new Chapter(frag, prev, c.time || duration, c.title);
        this.chapters[i].el.style.flex = String(Math.max(0, len / duration));
        prev = c.time || 0;
      });

      this.chapterEl.appendChild(frag);
    } else {
      this.chapters[0] = new Chapter(this.chapterEl, 0, duration);
    }
  }

  private setMarkers(duration: number) {
    this.config = {
      duration: 600,
      markers: [{
        time: 150,
        title: 'title1',
        image: 'nplayer2/m.png',
        size: [32, 34],
      }, {
        time: 300,
        title: 'title2',
        image: 'nplayer2/m.png',
        size: [32, 34],
      },
      {
        time: 550, title: 'title3', image: 'nplayer2/m.png', size: [32, 34],
      }],
    };
    if (!duration) return;
    const makers = this.config?.markers;
    if (makers && makers.length) {
      makers.forEach((m) => {
        if (m.image || m.el) {
          new Maker(this.markerEl, m, duration);
        }
      });
    }
  }

  private setHeatMap(duration: number) {
    duration = 600;
    this.config = {
      heatMap: {
        points: heatPoints,
        defaultDuration: 7.5,
      },
    };
    if (!duration) return;
    const heatMap = this.config?.heatMap;
    const points = heatMap?.points as {score: number; duration: number}[];
    const pointLen = points?.length;
    if (!pointLen || pointLen < 2) return;
    const defaultDuration = heatMap?.defaultDuration as number;
    const hasChapter = this.chapters.length > 1;
    const items: number[][][] = [[]];

    let curChapter = 0;
    let curItem;
    let point;
    let rDur;
    let max = 0;
    let total = 0;
    let curDuration = 0;
    let curLen = 0;
    let totalX = 0;
    let x = 0;
    for (let i = 0; i < pointLen; i++) {
      point = points[i];
      if (isNumber(point)) {
        point = points[i] = { score: point, duration: defaultDuration };
      } else {
        point.duration = point.duration || defaultDuration;
      }
      if ((points[i] as any).duration == null) {
        // console.error();
        return;
      }
      if (points[i].score > max) {
        max = points[i].score;
      }

      curDuration = hasChapter ? this.chapters[curChapter].duration : duration;

      curLen = point.duration / curDuration * 1000;
      x = totalX + curLen / 2;
      totalX += curLen;

      if (hasChapter) {
        total += point.duration;
        curItem = items[curChapter];
        const end = this.chapters[curChapter].end;
        if (total > end) {
          if (this.chapters[curChapter + 1]) {
            rDur = total - end;
            curItem.push([1000, point.score]);
            items[++curChapter] = [[0, point.score]];
            totalX = rDur / this.chapters[curChapter].duration * 1000;
          } else {
            curItem.push([1000, point.score]);
          }
        } else {
          curItem.push([x, point.score]);
        }
      } else {
        items[0].push([x, point.score]);
      }
    }
    items.forEach((item, i) => {
      this.headMaps[i] = new HeatMap(this.heatEl, item, max, hasChapter ? this.chapters[i].el.style.flex : undefined);
    });
  }
}
