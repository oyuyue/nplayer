import { DanmakuOptions } from './danmaku';

export function isDefaultColor(color: string): boolean {
  if (!color) return true;
  color = color.toLowerCase();
  return color === '#fff' || color === '#ffffff';
}

export function createTimer() {
  return {
    _prevPauseTime: 0,
    _pausedTime: 0,
    _paused: false,

    now() {
      return ((this._paused ? this._prevPauseTime : Date.now()) - this._pausedTime) / 1000;
    },

    play() {
      if (!this._paused) return;
      this._pausedTime += (Date.now() - this._prevPauseTime);
      this._paused = false;
    },

    pause() {
      if (this._paused) return;
      this._prevPauseTime = Date.now();
      this._paused = true;
    },
  };
}

const storageKey = 'nplayer:danmaku';
export function getStorageOptions(): DanmakuOptions | undefined {
  try {
    const optStr = window.localStorage.getItem(storageKey);
    if (!optStr) return;
    return JSON.parse(optStr);
  } catch (error) {
    // ignore
  }
}
export function setStorageOptions(opts: DanmakuOptions) {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(opts));
  } catch (error) {
    // ignore
  }
}

export const SEND_SETTINGS = 'Send settings';
export const SEND = 'Send';
export const MODE = 'Mode';
export const SCROLL = 'Scroll';
export const TOP = 'Top';
export const BOTTOM = 'Bottom';
export const COLOR = 'Color';
export const COLOUR = 'Color';
export const DANMAKU_SETTINGS = 'Danmaku settings';
export const ONOFF = 'On/Off';
export const RESTORE = 'Restore settings';
export const BLOCK_BT = 'Block by type';
export const OPACITY = 'Opacity &nbsp;';
export const DISPLAY_A = 'Area &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
export const HALF_S = 'Half';
export const FULL_S = 'Full';
export const DANMAKU_S = 'Speed &nbsp;&nbsp;&nbsp;';
export const SLOW = 'Slow';
export const FAST = 'Fast';
export const FONTSIZE = 'Font size';
export const SMALL = 'Small';
export const BIG = 'Big';
export const UNLIMITED = 'Unlimited';
export const BOTTOM_TT = 'Bottom to top';

export const trans = {
  [SEND_SETTINGS]: '发送设置',
  [SEND]: '发送',
  [MODE]: '模式',
  [SCROLL]: '滚动',
  [TOP]: '顶部',
  [BOTTOM]: '底部',
  [COLOR]: '颜色',
  [COLOUR]: '彩色',
  [DANMAKU_SETTINGS]: '弹幕设置',
  [ONOFF]: '开/关',
  [RESTORE]: '恢复默认设置',
  [BLOCK_BT]: '按类型屏蔽',
  [OPACITY]: '不透明度',
  [DISPLAY_A]: '显示区域',
  [HALF_S]: '半屏',
  [FULL_S]: '全屏',
  [DANMAKU_S]: '弹幕速度',
  [SLOW]: '慢',
  [FAST]: '快',
  [FONTSIZE]: '字体大小',
  [SMALL]: '小',
  [BIG]: '大',
  [UNLIMITED]: '不限弹幕',
  [BOTTOM_TT]: '从下到上',
};

export const EVENT = {
  DANMAKU_SEND: 'DanmakuSend',
  DANMAKU_UPDATE_OPTIONS: 'DanmakuUpdateOptions',
} as const;
