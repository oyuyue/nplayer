export interface Language {
  addLang: (lang: string, data: Record<string, string>) => void;
  fallback: () => void;
  t: (key: string, lang: string) => string;
  lang: { [key: string]: Record<string, string> };
}

export const FULL_SCREEN = 'Fullscreen';
export const EXIT_FULL_SCREEN = 'Exit fullscreen';
export const SETTINGS = 'Settings';
export const PLAY = 'Play';
export const PAUSE = 'Pause';
export const MUTE = 'Mute';
export const UNMUTE = 'Unmute';
export const NORMAL = 'Normal';
export const SPEED = 'Speed';
export const CAPTIONS = 'Captions';
export const CLOSE = 'Close';

const language: Language = {
  lang: {
    'zh-CN': {
      [FULL_SCREEN]: '全屏',
      [EXIT_FULL_SCREEN]: '取消全屏',
      [SETTINGS]: '设置',
      [PLAY]: '播放',
      [PAUSE]: '暂停',
      [MUTE]: '静音',
      [UNMUTE]: '取消静音',
      [NORMAL]: '正常',
      [SPEED]: '速度',
      [CAPTIONS]: '字幕',
      [CLOSE]: '关闭',
    },
  },
  addLang(lang: string, data: Record<string, string>): void {
    this.lang[lang] = { ...this.lang[lang], ...data };
    this.fallback();
  },
  fallback(): void {
    Object.keys(this.lang).forEach((k) => {
      this.lang[k.split('-')[0]] = this.lang[k];
    });
  },
  t(key: string, lang: string): string {
    const trans = this.lang[lang] || this.lang[lang.split('-')[0]];
    return (trans && trans[key]) || key;
  },
} as Language;

language.fallback();

export default language;
