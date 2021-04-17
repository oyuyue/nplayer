import { Disposable } from '../types';
import {
  $, dispose, removeNode,
} from '.';
import { isString } from './is';

export class Component implements Disposable {
  element: HTMLElement;

  constructor(
    container?: HTMLElement,
    desc?: string | HTMLElement,
    attrs?: { [key: string]: any; },
    children?: string | Array<Node>,
    classPrefix?: string,
  ) {
    if (desc && !isString(desc)) {
      this.element = desc;
    } else {
      this.element = $(desc, attrs, children, classPrefix);
    }
    if (container) container.appendChild(this.element);
  }

  applyStyle(style: Partial<CSSStyleDeclaration>): void {
    Object.assign(this.element.style, style);
  }

  dispose() {
    if (!this.element) return;
    removeNode(this.element);
    this.element = null!;
    dispose(this);
  }
}
