import RPlayer from 'rplayer';

export interface Item {
  text: string;
  time: number;
  color?: string;
  fontFamily?: string;
  type?: 'top' | 'bottom' | 'scroll';
  isMe?: boolean;
}

export interface DanmakuOpts {
  items?: Item[];
  area?: number;
  opacity?: number;
  fontSize?: number;
  staticFrame?: number;
  scrollFrame?: number;
  blockTypes?: Item['type'][];
}

export default function processOpts(opts: DanmakuOpts): DanmakuOpts {
  opts.area = RPlayer.utils.isNum(opts.area) ? opts.area : 0.5;
  opts.opacity = opts.opacity || 1;
  opts.items = opts.items || [];
  opts.staticFrame = opts.staticFrame || 300;
  opts.scrollFrame = opts.scrollFrame || 500;
  opts.blockTypes = opts.blockTypes || [];
  return opts;
}
