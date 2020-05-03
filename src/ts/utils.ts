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
): ChildNode {
  return domParser.parseFromString(str, type).firstChild;
}
