import { Destroyable } from '../types';
import { isBrowser } from './env';
import { isBool } from './is';

let thirdOptsSupported = false;

if (isBrowser) {
  try {
    const options = Object.defineProperty({}, 'once', { get() { thirdOptsSupported = true; } });
    window.addEventListener('test', null as any, options);
  // eslint-disable-next-line no-empty
  } catch (e) {}
}

export class DomListener implements Destroyable {
  constructor(
    private node: EventTarget,
    private type: string,
    private handler: (e: any) => void,
    private options?: boolean | AddEventListenerOptions,
  ) {
    this.options = isBool(options) ? options : options ? (thirdOptsSupported && options) : false;
    node.addEventListener(type, handler, this.options);
  }

  destroy(): void {
    if (!this.handler) return;
    this.node.removeEventListener(this.type, this.handler, this.options);
    this.node = null!;
    this.handler = null!;
    this.options = null!;
  }
}

const destroyableMap: Map<any, Array<Destroyable>> = new Map();

export function getDestroyableMap(): Map<any, Array<Destroyable>> {
  return destroyableMap;
}

export function addDestroyable<T extends Destroyable>(key: any, destroyable: T): T {
  if (!destroyableMap.has(key)) destroyableMap.set(key, []);
  destroyableMap.get(key)!.push(destroyable);
  return destroyable;
}

export function callAndRemoveDestroyable<T extends Destroyable>(key: any, destroyable?: T) {
  if (!destroyable) return;
  if (destroyableMap.has(key)) {
    destroyableMap.set(key, destroyableMap.get(key)!.filter((x) => x !== destroyable));
  }
  destroyable.destroy();
}

export function destroy(key: any): void {
  if (destroyableMap.has(key)) {
    destroyableMap.get(key)!.forEach((item) => item.destroy());
    destroyableMap.delete(key);
  }
}

export function addDestroyableListener<K extends keyof GlobalEventHandlersEventMap>(
  key: any,
  node: EventTarget,
  type: K,
  handler: (event: GlobalEventHandlersEventMap[K]) => void,
  useCapture?: boolean): DomListener;
export function addDestroyableListener(
  key: any,
  el: EventTarget,
  type: string,
  listener: EventListener,
  options?: boolean | AddEventListenerOptions,
): DomListener {
  const domListener = new DomListener(el, type, listener, options);
  if (key) addDestroyable(key, domListener);
  return domListener;
}
