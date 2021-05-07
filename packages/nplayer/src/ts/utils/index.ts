import { Disposable } from '../types';
import {
  DomListener, $, createSvg, getEventPath, removeNode, addClass,
} from './dom';

export * from './drag';
export * from './rect';
export * from './dom';
export * from './is';
export * from './env';
export * from './emitter';
export * from './component';
export * from './patch';

export function clamp(n: number, lower = 0, upper = 1): number {
  return Math.max(Math.min(n, upper), lower);
}

const disposableMap: Map<any, Array<Disposable>> = new Map();

export function getDisposableMap(): Map<any, Array<Disposable>> {
  return disposableMap;
}

export function addDisposable<T extends Disposable>(key: any, disposable: T): T {
  if (!disposableMap.has(key)) disposableMap.set(key, []);
  disposableMap.get(key)!.push(disposable);
  return disposable;
}

export function dispose(key: any): void {
  if (disposableMap.has(key)) {
    disposableMap.get(key)!.forEach((item) => item.dispose());
    disposableMap.delete(key);
  }
}

export function addDisposableListener<K extends keyof GlobalEventHandlersEventMap>(
  key: any,
  node: EventTarget,
  type: K,
  handler: (event: GlobalEventHandlersEventMap[K]) => void,
  useCapture?: boolean): DomListener;
export function addDisposableListener(
  key: any,
  el: EventTarget,
  type: string,
  listener: EventListener,
  options?: boolean | AddEventListenerOptions,
): DomListener {
  const domListener = new DomListener(el, type, listener, options);
  if (key) addDisposable(key, domListener);
  return domListener;
}

export function throttle(fn: Function, ctx?: any): any {
  let pending = false;
  let first = true;
  let args: typeof arguments | null = null;
  return function () {
    args = arguments;
    if (first) {
      first = false;
      return fn.apply(ctx, args);
    }

    if (pending) return;
    pending = true;

    requestAnimationFrame(() => {
      fn.apply(ctx, args);
      pending = false;
    });
  };
}

export function repeatStr(str: string, t: number): string {
  const ret = [];
  for (let i = 0; i < t; ++i) {
    ret.push(str);
  }
  return ret.join('');
}

function padStart(v: string | number, len = 2, str = '0'): string {
  v = String(v);
  if (v.length >= 2) return v;

  for (let i = 0, l = len - v.length; i < l; i++) {
    v = str + v;
  }

  return v;
}

export function formatTime(seconds: number): string {
  // eslint-disable-next-line no-restricted-globals
  if (!isFinite(seconds)) return '-';
  if (seconds <= 0) return '0:00';

  seconds = Math.round(seconds);
  if (seconds < 60) return `0:${padStart(seconds)}`;
  if (seconds < 3600) {
    return `${Math.floor(seconds / 60)}:${padStart(seconds % 60)}`;
  }

  return `${Math.floor(seconds / 3600)}:${padStart(
    Math.floor((seconds % 3600) / 60),
  )}:${padStart(seconds % 60)}`;
}

export const internalUtils = {
  $, clamp, addDisposableListener, addDisposable, createSvg, dispose, getEventPath, removeNode, addClass,
};
