import { RPlayerOptions } from './options';
export interface StorageOpts {
    enable?: boolean;
    key?: string;
}
export default class Storage {
    private key;
    private enable;
    constructor(opts: RPlayerOptions);
    static get supported(): boolean;
    get<T = string>(key?: string, orRet?: T): T;
    set(obj: Record<string, any>): void;
}
