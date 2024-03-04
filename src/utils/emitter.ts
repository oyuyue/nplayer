import { isFunction } from './is';
import { Destroyable } from '../types';

/**
 * @see https://github.com/primus/eventemitter3
 *
 * Representation of a single event listener.
 *
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} [once=false] Specify if the listener is a one-time listener.
 * @constructor
 * @private
 */
class EE {
  constructor(public fn: Function, public context: any, public once: boolean) {
    this.once = once || false;
  }
}

type ValidEventTypes = string | symbol | object

type EventNames<T extends ValidEventTypes> = T extends string | symbol
    ? T
    : keyof T;

type ArgumentMap<T extends object> = {
      [K in keyof T]: T[K] extends (...args: any[]) => void
        ? Parameters<T[K]>
        : T[K] extends any[]
        ? T[K]
        : any[];
    };

type EventListener<
    T extends ValidEventTypes,
    K extends EventNames<T>
  > = T extends string | symbol
    ? (...args: any[]) => void
    : (
        ...args: ArgumentMap<Exclude<T, string | symbol>>[Extract<K, keyof T>]
      ) => void;

type EventArgs<
      T extends ValidEventTypes,
      K extends EventNames<T>
    > = Parameters<EventListener<T, K>>;

/**
 * Minimal `EventEmitter` interface that is molded against the Node.js
 * `EventEmitter` interface.
 *
 * @constructor
 * @public
 */
export class EventEmitter<
  EventTypes extends ValidEventTypes = string | symbol,
  Context extends any = any
> {
  private _events: Record<EventNames<EventTypes>, any> = Object.create(null);

  private _eventsCount = 0;

  emitAsync<T extends EventNames<EventTypes>>(evt: T, a1?: EventArgs<EventTypes, T>[0], time = 0): void {
    setTimeout(() => this.emit(evt, a1), time);
  }

  emit<T extends EventNames<EventTypes>>(evt: T, a1?: EventArgs<EventTypes, T>[0]): void {
    if (!this._events[evt]) return;

    const listeners = this._events[evt];

    if (listeners.fn) {
      if (listeners.once) this.off(evt, listeners.fn, undefined, true);
      listeners.fn.call(listeners.context, a1);
    } else {
      const length = listeners.length;
      for (let i = 0; i < length; i++) {
        if (listeners[i].once) this.off(evt, listeners[i].fn, undefined, true);
        listeners[i].fn.call(listeners[i].context, a1);
      }
    }
  }

  on<T extends EventNames<EventTypes>>(evt: T, fn: EventListener<EventTypes, T>, context?: Context, once = false): Destroyable {
    if (!isFunction(fn)) {
      throw new TypeError('The listener must be a function');
    }

    const listener = new EE(fn, context || this, once);

    // eslint-disable-next-line no-unused-expressions
    if (!this._events[evt]) this._events[evt] = listener, this._eventsCount++;
    else if (!this._events[evt].fn) this._events[evt].push(listener);
    else this._events[evt] = [this._events[evt], listener];

    return { destroy: this.off.bind(this, evt as any, fn as any) };
  }

  once<T extends EventNames<EventTypes>>(event: T, fn: EventListener<EventTypes, T>, context?: Context): Destroyable {
    return this.on(event, fn, context, true);
  }

  off<T extends EventNames<EventTypes>>(evt?: T, fn?: EventListener<EventTypes, T>, context?: Context, once?: boolean): this {
    if (!evt) {
      this._events = Object.create(null);
      this._eventsCount = 0;
      return this;
    }
    if (!this._events[evt]) return this;
    if (!fn) {
      this.clearEvent(evt);
      return this;
    }

    const listeners = this._events[evt];
    const events = [];

    if (listeners.fn) {
      if (
        listeners.fn === fn
        && (!once || listeners.once)
        && (!context || listeners.context === context)
      ) {
        this.clearEvent(evt);
      }
    } else {
      for (let i = 0, length = listeners.length; i < length; i++) {
        if (
          listeners[i].fn !== fn
          || (once && !listeners[i].once)
          || (context && listeners[i].context !== context)
        ) {
          events.push(listeners[i]);
        }
      }

      //
      // Reset the array, or remove it completely if we have no more listeners.
      //
      if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
      else this.clearEvent(evt);
    }

    return this;
  }

  private clearEvent(evt: any) {
    if (--this._eventsCount === 0) this._events = Object.create(null);
    else delete (this._events as any)[evt];
  }
}
