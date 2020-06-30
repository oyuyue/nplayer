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
  colors?: string[];
  type?: number;
  color?: number;
  sendPlaceholder?: string;
  sendHide?: boolean;
  maxLen?: number;
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
  if (!Array.isArray(opts.colors) || !opts.colors.length) {
    opts.colors = [
      '',
      '#F44336',
      '#E91E63',
      '#9C27B0',
      '#673AB7',
      '#3F51B5',
      '#2196F3',
      '#03A9F4',
      '#00BCD4',
      '#009688',
      '#4CAF50',
      '#8BC34A',
      '#CDDC39',
      '#FF5722',
      '#607D8B',
    ];
  }
  opts.sendPlaceholder = U.isStr(opts.sendPlaceholder)
    ? opts.sendPlaceholder
    : '发个弹幕';
  opts.color = U.clamp(opts.color || 0, 0, opts.colors.length - 1);
  opts.type = U.clamp(opts.type || 0, 0, 2);
  opts.sendHide = opts.sendHide || false;
  opts.maxLen = opts.maxLen || 50;
  return opts;
}
