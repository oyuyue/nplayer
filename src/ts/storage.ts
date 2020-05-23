import { RPlayerOptions } from './options';
import { extend, isObj, safeJsonParse, safeJsonStringify } from './utils';

export interface StorageOpts {
  enable?: boolean;
  key?: string;
}

export default class Storage {
  private key: string;
  private enable: boolean;

  constructor(opts: RPlayerOptions) {
    this.enable = Storage.supported && opts.storage.enable;
    this.key = opts.storage.key;
  }

  static get supported(): boolean {
    try {
      const test = 'rplayer___';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }

  get<T = string>(key?: string, orRet?: T): T {
    if (!this.enable) return orRet;
    const data = localStorage.getItem(this.key);
    if (data == null) return orRet;
    const obj = safeJsonParse(data, null);
    if (!key) return obj || orRet;
    return isObj(obj) && obj[key] != null ? obj[key] : orRet;
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
