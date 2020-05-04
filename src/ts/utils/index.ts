export { default as Drag } from './drag';

export function getDomOr<T extends HTMLElement>(
  dom: HTMLElement | string,
  orReturn?: T
): T {
  let ret: T = dom as T;
  if (typeof dom === 'string') ret = document.querySelector(dom);
  return ret || orReturn;
}

export function clamp(n: number, lower = 0, upper = 1): number {
  return Math.max(Math.min(n, upper), lower);
}

export function isStr(o: any): o is string {
  return typeof o === 'string';
}

export function isFn(o: any): o is Function {
  return typeof o === 'function';
}

export function htmlDom(html: string, tag = 'span'): HTMLElement {
  const d = document.createElement(tag);
  d.innerHTML = html;
  return d;
}

export function findEventDataset(
  ev: Event,
  predicate: (map: DOMStringMap) => boolean
): DOMStringMap {
  if (!ev || ev.composedPath) return;
  const path = ev.composedPath() as HTMLElement[];
  if (path) {
    for (let i = 0; i < path.length; i++) {
      const d = path[i].dataset;
      if (d && predicate(d)) return d;
    }
  }
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
  if (className) dom.classList.add(className);
  return dom;
}

export function padStart(v: string | number, len = 2, str = '0'): string {
  v = String(v);
  if (v.length >= 2) return v;
  return (
    Array(len - v.length)
      .fill(str)
      .join('') + v
  );
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
  isEdge: window.navigator.userAgent.includes('Edge'),
  isWebkit:
    'WebkitAppearance' in document.documentElement.style &&
    !/Edge/.test(navigator.userAgent),
  isIPhone: /(iPhone|iPod)/gi.test(navigator.platform),
  isIos: /(iPad|iPhone|iPod)/gi.test(navigator.platform),
};
