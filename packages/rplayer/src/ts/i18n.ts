import language, { Language } from './config/lang';
import { RPlayerOptions } from './options';

export function fallback(): Language {
  Object.keys(language).forEach((k) => {
    language[k.split('-')[0]] = language[k];
  });
  return language;
}

export function t(key: string, lang: string): string {
  const trans = language[lang] || language[lang.split('-')[0]];
  return (trans && trans[key]) || key;
}

fallback();

export default class I18n {
  lang: string;
  fallback = fallback;

  constructor(opts: RPlayerOptions) {
    this.lang = opts.lang;
  }

  t(key: string, lang = this.lang): string {
    return t(key, lang);
  }

  static addLang(lang: string, data: Record<string, string>): void {
    language[lang] = data;
    fallback();
  }
}
