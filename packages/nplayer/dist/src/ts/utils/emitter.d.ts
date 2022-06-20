import { Disposable } from '../types';
/**
 * Minimal `EventEmitter` interface that is molded against the Node.js
 * `EventEmitter` interface.
 *
 * @constructor
 * @public
 */
export declare class EventEmitter {
    private _events;
    private _eventsCount;
    constructor();
    emit(evt: string, a1?: any, a2?: any, a3?: any, a4?: any, a5?: any): boolean;
    on(evt: string, fn: Function, context?: any, once?: boolean): Disposable;
    once(event: string, fn: Function, context?: any): Disposable;
    off(evt: string, fn?: Function, context?: any, once?: boolean): this;
    removeAllListeners(evt?: string): this;
    private clearEvent;
}
