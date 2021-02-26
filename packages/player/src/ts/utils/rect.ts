import { Disposable } from '../types';

export class Rect implements Disposable {
  private rect!: DOMRect;

  constructor(private element: HTMLElement) {
    this.rect = {} as DOMRect;
  }

  get width(): number {
    this.tryUpdate(this.rect.width);
    return this.rect.width;
  }

  get height(): number {
    this.tryUpdate(this.rect.height);
    return this.rect.height;
  }

  get x(): number {
    this.tryUpdate(this.rect.left);
    return this.rect.left;
  }

  get y(): number {
    this.tryUpdate(this.rect.top);
    return this.rect.top;
  }

  private tryUpdate(v: number): void {
    if (!v) this.update();
  }

  update(): void {
    this.rect = this.element.getBoundingClientRect();
  }

  dispose(): void {
    this.element = null!;
    this.rect = null!;
  }
}
