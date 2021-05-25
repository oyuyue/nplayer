import { Disposable } from '../types';

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

/**
 * Minimal `EventEmitter` interface that is molded against the Node.js
 * `EventEmitter` interface.
 *
 * @constructor
 * @public
 */
export class EventEmitter {
  private _events: Record<string, any>;

  private _eventsCount: number;

  constructor() {
    this._events = Object.create(null);
    this._eventsCount = 0;
  }

  emit(evt: string, a1?: any, a2?: any, a3?: any, a4?: any, a5?: any): boolean {
    if (!this._events[evt]) return false;

    const listeners = this._events[evt];
    const len = arguments.length;
    let args;
    let i;

    if (listeners.fn) {
      if (listeners.once) this.off(evt, listeners.fn, undefined, true);

      switch (len) {
        case 1: return listeners.fn.call(listeners.context), true;
        case 2: return listeners.fn.call(listeners.context, a1), true;
        case 3: return listeners.fn.call(listeners.context, a1, a2), true;
        case 4: return listeners.fn.call(listeners.context, a1, a2, a3), true;
        case 5: return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
        case 6: return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
      }

      for (i = 1, args = new Array(len - 1); i < len; i++) {
        args[i - 1] = arguments[i];
      }

      listeners.fn.apply(listeners.context, args);
    } else {
      const length = listeners.length;
      let j;

      for (i = 0; i < length; i++) {
        if (listeners[i].once) this.off(evt, listeners[i].fn, undefined, true);

        switch (len) {
          case 1: listeners[i].fn.call(listeners[i].context); break;
          case 2: listeners[i].fn.call(listeners[i].context, a1); break;
          case 3: listeners[i].fn.call(listeners[i].context, a1, a2); break;
          case 4: listeners[i].fn.call(listeners[i].context, a1, a2, a3); break;
          default:
            if (!args) {
              for (j = 1, args = new Array(len - 1); j < len; j++) {
                args[j - 1] = arguments[j];
              }
            }

            listeners[i].fn.apply(listeners[i].context, args);
        }
      }
    }

    return true;
  }

  on(evt: string, fn: Function, context?: any, once = false): Disposable {
    if (typeof fn !== 'function') {
      throw new TypeError('The listener must be a function');
    }

    const listener = new EE(fn, context || this, once);

    // eslint-disable-next-line no-unused-expressions
    if (!this._events[evt]) this._events[evt] = listener, this._eventsCount++;
    else if (!this._events[evt].fn) this._events[evt].push(listener);
    else this._events[evt] = [this._events[evt], listener];

    return { dispose: this.off.bind(this, evt, fn) };
  }

  once(event: string, fn: Function, context?: any): Disposable {
    return this.on(event, fn, context, true);
  }

  off(evt: string, fn?: Function, context?: any, once?: boolean): this {
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

  removeAllListeners(evt?: string): this {
    if (evt) {
      if (this._events[evt]) this.clearEvent(evt);
    } else {
      this._events = Object.create(null);
      this._eventsCount = 0;
    }

    return this;
  }

  private clearEvent(evt: string) {
    if (--this._eventsCount === 0) this._events = Object.create(null);
    else delete this._events[evt];
  }
}
