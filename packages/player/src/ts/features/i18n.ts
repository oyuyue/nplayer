import { isBrowser } from '../utils';

const data: Record<string, Record<string, string>> = Object.create(null);

export const FULL_SCREEN = 'Fullscreen';
export const EXIT_FULL_SCREEN = 'Exit fullscreen';
export const WEB_FULL_SCREEN = 'Web fullscreen';
export const WEB_EXIT_FULL_SCREEN = 'Web exit fullscreen';
export const SETTINGS = 'Settings';
export const PLAY = 'Play';
export const PAUSE = 'Pause';
export const MUTE = 'Mute';
export const UNMUTE = 'Unmute';
export const NORMAL = 'Normal';
export const SPEED = 'Speed';

export const I18n = {
  defaultLang: '',
  currentLang: '',
  t(key: string, lang?: string): string {
    return data[lang || I18n.currentLang || I18n.defaultLang]?.[key] || key;
  },
  add(lang: string, transData: Record<string, string>): void {
    data[lang] = { ...data[lang], ...transData };
    I18n.fallback();
  },
  fallback(): void {
    Object.keys(data).forEach((k) => {
      data[k.split('-')[0]] = data[k];
    });
  },
  setCurrentLang(lang?: string): void {
    this.currentLang = lang || navigator.language || (navigator as any).userLanguage;
  },
  setDefaultLang(lang?: string): void {
    this.defaultLang = lang || '';
  },
};

I18n.add('zh-CN', {
  [FULL_SCREEN]: '全屏',
  [EXIT_FULL_SCREEN]: '取消全屏',
  [WEB_FULL_SCREEN]: '网页全屏',
  [WEB_EXIT_FULL_SCREEN]: '退出网页全屏',
  [SETTINGS]: '设置',
  [PLAY]: '播放',
  [PAUSE]: '暂停',
  [MUTE]: '静音',
  [UNMUTE]: '取消静音',
  [NORMAL]: '正常',
  [SPEED]: '速度',
});
if (isBrowser) I18n.setCurrentLang();
