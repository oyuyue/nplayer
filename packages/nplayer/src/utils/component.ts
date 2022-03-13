import { Disposable } from '../types';
import {
  $, dispose, removeNode,
} from '.';
import { isString } from './is';

export class Component implements Disposable {
  el: HTMLElement;

  constructor(
    container?: HTMLElement,
    desc?: string | HTMLElement,
    attrs?: { [key: string]: any; },
    children?: string | Array<Node>,
    classPrefix?: string,
  ) {
    if (desc && !isString(desc)) {
      this.el = desc;
    } else {
      this.el = $(desc, attrs, children, classPrefix);
    }
    if (container) container.appendChild(this.el);
  }

  applyStyle(style: Partial<CSSStyleDeclaration>): void {
    Object.assign(this.el.style, style);
  }

  dispose() {
    removeNode(this.el);
    dispose(this);
  }
}
