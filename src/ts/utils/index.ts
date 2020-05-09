export { default as Drag } from './drag';

export function noop(): void {}

export function clamp(n: number, lower = 0, upper = 1): number {
  return Math.max(Math.min(n, upper), lower);
}

export function isStr(o: any): o is string {
  return typeof o === 'string';
}

export function isNum(o: any): o is number {
  return typeof o === 'number' && !isNaN(o);
}

export function isFn(o: any): o is Function {
  return typeof o === 'function';
}

export function isObj(o: any): o is Record<string, any> {
  return typeof o === 'object';
}

export function isCatchable(o: any): o is { catch: Function } {
  return isObj(o) && isFn(o.catch);
}

export function findIndex<T>(
  arr: T[],
  predicate: (value: T, index: number, obj: T[]) => unknown
): number {
  if (arr.findIndex) return arr.findIndex(predicate);

  for (let i = 0, l = arr.length; i < l; i++) {
    if (predicate(arr[i], i, arr)) return i;
  }

  return -1;
}

export function getDomOr<T extends HTMLElement>(
  dom: HTMLElement | string,
  orReturn?: (() => T) | T
): T {
  let ret: T = dom as T;
  if (typeof dom === 'string') ret = document.querySelector(dom);
  return ret || (isFn(orReturn) ? orReturn() : orReturn);
}

export function htmlDom(html: string, tag = 'span'): HTMLElement {
  const d = document.createElement(tag);
  d.innerHTML = html;
  return d;
}

export function measureElementSize(
  dom: HTMLElement
): { width: number; height: number } {
  const clone = dom.cloneNode(true) as HTMLElement;
  clone.style.position = 'absolute';
  clone.style.opacity = '0';
  clone.removeAttribute('hidden');

  dom.parentNode.appendChild(clone);

  const width = clone.scrollWidth;
  const height = clone.scrollHeight;

  dom.parentNode.removeChild(clone);

  return { width, height };
}

export function newElement<T extends HTMLElement>(
  tag: keyof HTMLElementTagNameMap = 'div'
): T {
  return document.createElement(tag) as any;
}

const domParser = window.DOMParser ? new DOMParser() : null;
export function strToDom(
  str: string,
  type: SupportedType = 'image/svg+xml'
): HTMLElement {
  return domParser.parseFromString(str, type).firstChild as HTMLElement;
}

export function svgToDom(str: string, className?: string): HTMLElement {
  const dom = strToDom(str);
  if (className) {
    if (dom.classList) {
      dom.classList.add(className);
    } else {
      dom.setAttribute('class', className);
    }
  }
  return dom;
}

export function padStart(v: string | number, len = 2, str = '0'): string {
  v = String(v);
  if (v.length >= 2) return v;

  for (let i = 0, l = len - v.length; i < l; i++) {
    v = str + v;
  }

  return v;
}

export function formatTime(seconds: number): string {
  if (!seconds || seconds < 0) return '0:00';

  seconds = Math.round(seconds);
  if (seconds < 60) return `0:${padStart(seconds)}`;
  if (seconds < 3600) {
    return `${Math.floor(seconds / 60)}:${padStart(seconds % 60)}`;
  }

  return `${Math.floor(seconds / 3600)}:${padStart(
    Math.floor((seconds % 3600) / 60)
  )}:${padStart(seconds % 60)}`;
}

export const ua = {
  isIos: /(iPad|iPhone|iPod)/gi.test(navigator.platform),
};

export const makeDictionary = <T>(obj: T): T => {
  (obj as any).__ = undefined;
  delete (obj as any).__;
  return obj;
};
