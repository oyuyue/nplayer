/**
 * @see https://github.com/primus/eventemitter3
 *
 * Representation of a single event listener.
 */
class EE {
  constructor(public fn: Function, public once: boolean) {
    this.once = once;
  }
}

export class EventEmitter<TT> {
  private _events: Record<keyof TT, any> = Object.create(null);

  private _eventsCount = 0;

  emitMacro<T extends keyof TT>(evt: T, ev?: TT[T]) {
    setTimeout(() => this.emit(evt, ev), 0)
  }

  emitMicro<T extends keyof TT>(evt: T, ev?: TT[T]) {
    Promise.resolve().then(() => this.emit(evt, ev));
  }

  emit<T extends keyof TT>(evt: T, ev?: TT[T]) {
    if (!this._events[evt]) return;

    const listeners = this._events[evt];

    if (listeners.fn) {
      if (listeners.once) this.off(evt, listeners.fn);
      listeners.fn(ev);
    } else {
      const length = listeners.length;
      for (let i = 0; i < length; i++) {
        if (listeners[i].once) this.off(evt, listeners[i].fn);
        listeners[i].fn(ev);
      }
    }
  }

  on<T extends keyof TT>(evt: T, fn: (ev: TT[T]) => void) {
    const listener = new EE(fn, false);

    // eslint-disable-next-line no-unused-expressions
    if (!this._events[evt]) this._events[evt] = listener, this._eventsCount++;
    else if (!this._events[evt].fn) this._events[evt].push(listener);
    else this._events[evt] = [this._events[evt], listener];

    return () => {
      this.off(evt, fn)
    }
  }

  once<T extends keyof TT>(evt: T, fn: (ev: TT[T]) => void) {
    const listener = new EE(fn, true);

    // eslint-disable-next-line no-unused-expressions
    if (!this._events[evt]) this._events[evt] = listener, this._eventsCount++;
    else if (!this._events[evt].fn) this._events[evt].push(listener);
    else this._events[evt] = [this._events[evt], listener];

    return () => {
      this.off(evt, fn)
    }
  }

  off<T extends keyof TT>(evt?: T, fn?: (event: TT[T]) => void) {
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
    const events: any[] = [];

    if (listeners.fn) {
      if (listeners.fn === fn) {
        this.clearEvent(evt);
      }
    } else {
      for (let i = 0, length = listeners.length; i < length; i++) {
        if (listeners[i].fn !== fn) {
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
