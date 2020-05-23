import { DOT } from '../config/classname';
import { newElement } from '../utils';

export default class Dot {
  readonly dom: HTMLElement;

  constructor(className?: string) {
    this.dom = newElement(DOT);
    if (className) this.dom.classList.add(className);
  }

  setX(x: number): void {
    this.dom.style.transform = `translateX(${x}px)`;
  }
}
