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
  return typeof o === 'object' && o != null;
}

export function isElement(o: any): o is Element {
  return o instanceof Element;
}

export function isCatchable(o: any): o is { catch: Function } {
  return isObj(o) && isFn(o.catch);
}

export function clampNeg(n: number, max: number, defaults = max): number {
  if (n == null) n = defaults;
  if (n >= 0) return Math.min(n, max);
  return clampNeg(n + max, max);
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

export function htmlDom(
  html = '',
  tag = 'span',
  className?: string
): HTMLElement {
  const d = document.createElement(tag);
  d.innerHTML = html;
  if (className) d.classList.add(className);
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
  className?: string,
  tag: keyof HTMLElementTagNameMap = 'div'
): T {
  const dom = document.createElement(tag) as T;
  if (className) dom.classList.add(className);
  return dom;
}

const domParser = new DOMParser();
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
  isIE: /MSIE|Trident/.test(navigator.userAgent),
};

export const makeDictionary = <T>(obj: T): T => {
  (obj as any).__ = undefined;
  delete (obj as any).__;
  return obj;
};

export const getClientWH = (): [number, number] => {
  return [document.body.clientWidth, document.body.clientHeight];
};

export const safeJsonParse = <T extends Record<string, any>>(
  str: string,
  orRet?: T
): T | string => {
  try {
    return JSON.parse(str);
  } catch (e) {
    return orRet || str;
  }
};

export const safeJsonStringify = (
  obj: Record<string, any>,
  orRet = ''
): string => {
  try {
    return JSON.stringify(obj);
  } catch (e) {
    return orRet;
  }
};

export const extend = (
  target: Record<string, any> = {},
  source: Record<string, any>
): Record<string, any> => {
  if (!source) return target;

  Object.keys(source).forEach((key) => {
    if (isObj(source[key])) {
      if (!Object.keys(target).includes(key)) {
        target = { ...target, [key]: {} };
      }
      extend(target[key], source[key]);
    } else {
      target = { ...target, [key]: source[key] };
    }
  });

  return target;
};

export const ajax = (
  url: string,
  cb: (err: any, data?: string) => any
): void => {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function (): void {
    if (xhr.readyState == 4) {
      if (xhr.status >= 200 && xhr.status < 300) {
        cb(null, xhr.responseText);
      } else {
        cb({});
      }
    }
  };
  xhr.onerror = (err): void => cb(err);
  xhr.open('GET', url, true);
  xhr.send();
};
