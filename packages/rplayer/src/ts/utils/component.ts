import { Disposable } from '../types';
import {
  $, applyMixins, dispose, removeNode, EventEmitter,
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

type IEventComponent = new (...args: ConstructorParameters<typeof Component>) => Component & EventEmitter;

export const EventComponent = function (this: any) {
  new Component();
  new EventEmitter();
} as unknown as IEventComponent;

applyMixins(EventComponent, [Component, EventEmitter]);

const protoDispose = EventComponent.prototype.dispose;

EventComponent.prototype.dispose = function () {
  protoDispose.call(this);
  (this as any).removeAllListeners();
};
