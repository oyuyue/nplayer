export class I18n {
  static lang: string;

  static defaultLang: string;

  static data: Record<string, Record<string, string>> = {}

  static t(key: string, lang?: string): string {
    lang = lang?.toLowerCase() || I18n.lang || I18n.defaultLang;
    if (!lang) return key;
    const data = I18n.data[lang] || I18n.data[lang.split('-')[0]];
    return data?.[key] || key;
  }

  static add(lang: string, data: Record<string, string>) {
    lang = lang.toLowerCase();
    I18n.data[lang] = data;
    const parts = lang.split('-');
    if (parts.length > 1 && !I18n.data[parts[0]]) {
      I18n.data[parts[0]] = data;
    }
  }

  static setLang(lang: string) {
    I18n.lang = lang.toLowerCase();
  }

  static setDefaultLang(lang: string) {
    I18n.defaultLang = lang.toLowerCase();
  }
}
