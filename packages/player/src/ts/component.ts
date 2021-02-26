import { Disposable } from './types';
import { $, dispose, removeNode } from './utils';

export class Component implements Disposable {
  element: HTMLElement;

  constructor(
    container: HTMLElement,
    desc?: string,
    attrs?: { [key: string]: any; },
    children?: string | Array<Node>,
    classPrefix?: string,
  ) {
    this.element = container.appendChild($(desc, attrs, children, classPrefix));
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
