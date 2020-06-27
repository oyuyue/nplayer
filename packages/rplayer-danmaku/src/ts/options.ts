import RPlayer from 'rplayer';

export interface Item {
  text: string;
  time: number;
  color?: string;
  fontFamily?: string;
  type?: 'top' | 'bottom' | 'scroll';
  isMe?: boolean;
}

export interface DanmakuOptions {
  items?: Item[];
  on?: boolean;
  blockTypes?: ('scroll' | 'top' | 'bottom' | 'color')[];
  opacity?: number;
  area?: number;
  speed?: number;
  fontSize?: number;
  unlimited?: boolean;
  bottomUp?: boolean;
  merge?: boolean;
  baseFontSize?: number;
  staticFrame?: number;
  scrollFrame?: number;
}

const U = RPlayer.utils;

export default function processOpts(opts: DanmakuOptions): DanmakuOptions {
  opts.items = opts.items || [];
  opts.on = U.isBool(opts.on) ? opts.on : !!opts.items.length;
  opts.blockTypes = opts.blockTypes || [];
  opts.opacity = U.isNum(opts.opacity) ? U.clamp(opts.opacity, 0.1) : 1;
  opts.area = U.isNum(opts.area) ? U.clamp(opts.area, 0.25) : 0.5;
  opts.speed = U.isNum(opts.speed) ? U.clamp(opts.speed, 0.5, 1.5) : 1;
  opts.fontSize = U.isNum(opts.fontSize) ? U.clamp(opts.fontSize, 0.5, 1.5) : 1;
  opts.unlimited = U.isBool(opts.unlimited) ? opts.unlimited : false;
  opts.bottomUp = U.isBool(opts.bottomUp) ? opts.bottomUp : false;
  opts.merge = U.isBool(opts.merge) ? opts.merge : false;
  opts.staticFrame = opts.staticFrame || 300;
  opts.scrollFrame = opts.scrollFrame || 500;
  return opts;
}
