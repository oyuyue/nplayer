import { RPlayerOptions } from './options';
import { extend, isObj, safeJsonParse, safeJsonStringify } from './utils';

class Storage {
  private key: string;
  private enable: boolean;

  constructor(opts: RPlayerOptions) {
    this.enable = Storage.supported && opts.storage.enable;
    this.key = opts.storage.key;
  }

  static get supported(): boolean {
    try {
      if (!('localStorage' in window)) {
        return false;
      }

      const test = 'rplayer___';
      window.localStorage.setItem(test, test);
      window.localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }

  get<T = string>(key?: string, orRet?: T): T {
    if (!this.enable) return orRet;
    const data = localStorage.getItem(this.key);
    if (!data) return orRet;
    const obj = safeJsonParse(data, null);
    if (!key) return obj || orRet;
    return isObj(obj) ? obj[key] || orRet : orRet;
  }

  set(obj: Record<string, any>): void {
    if (!this.enable) return;
    if (!obj) return localStorage.removeItem(this.key);
    if (!isObj(obj)) return;
    localStorage.setItem(
      this.key,
      safeJsonStringify(extend(this.get(null, {}), obj))
    );
  }
}

export default Storage;
