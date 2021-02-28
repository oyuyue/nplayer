import { Disposable } from '../types';
import {
  $, applyMixins, dispose, removeNode, EventEmitter,
} from '.';

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

type IEventComponent = new (...args: ConstructorParameters<typeof Component>) => Component & EventEmitter;

export const EventComponent = function () {} as unknown as IEventComponent;

applyMixins(EventComponent, [Component, EventEmitter]);

const protoDispose = EventComponent.prototype.dispose;

EventComponent.prototype.dispose = function () {
  protoDispose.call(this);
  (this as any).removeAllListeners();
};
