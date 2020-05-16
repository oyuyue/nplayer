import { RPlayerOptions } from './options';
declare class Storage {
    private key;
    private enable;
    constructor(opts: RPlayerOptions);
    static get supported(): boolean;
    get<T = string>(key?: string, orRet?: T): T;
    set(obj: Record<string, any>): void;
}
export default Storage;
