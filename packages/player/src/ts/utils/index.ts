import { Disposable } from '../types';
import { DomListener } from './dom';

export * from './drag';
export * from './rect';
export * from './dom';
export * from './is';
export * from './env';

export function clamp(n: number, lower = 0, upper = 1): number {
  return Math.max(Math.min(n, upper), lower);
}

const disposableMap: Record<any, Array<Disposable>> = {};

export function addDisposable<T extends Disposable>(key: any, disposable: T): T {
  (disposableMap[key] = disposableMap[key] || []).push(disposable);
  return disposable;
}

export function dispose(key: any): void {
  if (disposableMap[key]) {
    disposableMap[key].forEach((item) => item.dispose());
    delete disposableMap[key];
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
