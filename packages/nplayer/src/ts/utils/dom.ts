import { isBool, isString } from '.';
import { CLASS_PREFIX } from '../constants';
import { Disposable } from '../types';
import { isBrowser } from './env';

const SELECTOR_REGEX = /([\w-]+)?(?:#([\w-]+))?((?:\.(?:[\w-]+))*)/;

export function $<T extends HTMLElement>(
  desc?: string,
  attrs?: { [key: string]: any; },
  children?: string | Array<Node>,
  classPrefix = CLASS_PREFIX,
): T {
  let match: string[] = [];

  if (desc) match = SELECTOR_REGEX.exec(desc) || [];

  const el = document.createElement(match[1] || 'div');

  if (match[2]) el.id = match[3];
  if (match[3]) el.className = match[3].replace(/\./g, ` ${classPrefix}`).trim();

  if (attrs) {
    Object.keys(attrs).forEach((name) => {
      const value = attrs[name];
      if (value === undefined) return;

      if (/^on\w+$/.test(name)) {
        (el as any)[name] = value;
      } else if (name === 'selected') {
        if (value) {
          el.setAttribute(name, 'true');
        }
      } else {
        el.setAttribute(name, value);
      }
    });
  }

  if (children) {
    if (isString(children)) {
      el.innerHTML = children;
    } else {
      children.forEach((c) => el.appendChild(c));
    }
  }

  return el as T;
}

export function getEl(el: HTMLElement | string | undefined | null): HTMLElement | null {
  if (!el) return null;
  if (isString(el)) return document.querySelector(el);
  return el;
}

export function removeNode(node: Element): void {
  if (!node) return;
  if (node.remove) {
    node.remove();
  } else if (node.parentNode) {
    node.parentNode.removeChild(node);
  }
}

export function show(node: HTMLElement | SVGElement): void {
  node.style.display = '';
}

export function hide(node: HTMLElement | SVGElement): void {
  node.style.display = 'none';
}

export function addClass<T extends Element>(dom: T, cls = '', prefix = CLASS_PREFIX): T {
  cls = cls.trim();
  if (!cls) return dom;
  if (dom.classList) {
    cls.split(' ').forEach((c) => dom.classList.add(prefix + c));
  } else {
    const oldCls = (dom.className && (dom.className as any).baseVal) || '';
    dom.setAttribute('class', (oldCls ? `${oldCls} ` : '') + cls.split(' ').map((c) => prefix + c).join(' '));
  }
  return dom;
}

export function removeClass<T extends Element>(dom: T, cls: string, prefix = CLASS_PREFIX): T {
  dom.classList.remove(prefix + cls);
  return dom;
}

export function containClass(dom: Element, cls: string, prefix = CLASS_PREFIX): boolean {
  return dom.classList.contains(prefix + cls);
}

export function toggleClass(dom: Element, cls: string, force?: boolean, prefix = CLASS_PREFIX): boolean {
  cls = prefix + cls;
  if (force) {
    dom.classList.add(cls);
    return true;
  } if (force === false) {
    dom.classList.remove(cls);
    return true;
  }
  return dom.classList.toggle(cls, force);
}

const svgNS = 'http://www.w3.org/2000/svg';

export function createSvg(cls?: string, d?: string, viewBox = '0 0 24 24'): SVGSVGElement {
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('viewBox', viewBox);
  if (cls) addClass(svg, cls);
  if (d) {
    const path = document.createElementNS(svgNS, 'path');
    path.setAttributeNS(null, 'd', d);
    svg.appendChild(path);
  }
  return svg;
}

export function getEventPath(ev: Event): EventTarget[] {
  return (ev as any).path || ev.composedPath();
}

let thirdOptsSupported = false;

if (isBrowser) {
  try {
    const options = Object.defineProperty({}, 'once', { get() { thirdOptsSupported = true; } });
    window.addEventListener('test', null as any, options);
  // eslint-disable-next-line no-empty
  } catch (e) {}
}

export function isListenerObjOptsSupported(): boolean {
  return thirdOptsSupported;
}

export class DomListener implements Disposable {
  constructor(
    private node: EventTarget,
    private type: string,
    private handler: (e: any) => void,
    private options?: boolean | AddEventListenerOptions,
  ) {
    this.options = isBool(options) ? options : options ? (thirdOptsSupported && options) : false;
    node.addEventListener(type, handler, this.options);
  }

  dispose(): void {
    if (!this.handler) return;
    this.node.removeEventListener(this.type, this.handler, this.options);
    this.node = null!;
    this.handler = null!;
    this.options = null!;
  }
}

export function measureElementSize(
  dom: HTMLElement,
): { width: number; height: number } {
  const clone = dom.cloneNode(true) as HTMLElement;
  clone.style.position = 'absolute';
  clone.style.opacity = '0';
  clone.removeAttribute('hidden');

  const parent = dom.parentNode || document.body;

  parent.appendChild(clone);

  const rect = clone.getBoundingClientRect();

  parent.removeChild(clone);

  return rect;
}
