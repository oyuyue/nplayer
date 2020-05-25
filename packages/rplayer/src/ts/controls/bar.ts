import { BAR } from '../config/classname';
import { clamp, newElement } from '../utils';

export default class Bar {
  readonly dom: HTMLElement;

  constructor(className?: string) {
    this.dom = newElement(BAR);
    if (className) this.dom.classList.add(className);
  }

  setX(x: number): void {
    this.dom.style.transform = `scaleX(${clamp(x)})`;
  }
}
