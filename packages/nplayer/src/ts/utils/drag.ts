import { Disposable } from '../types';

type Fn = (ev: PointerEvent) => any;

export class Drag implements Disposable {
  private el: HTMLElement;

  private start: Fn;

  private move: Fn;

  private end: Fn | undefined;

  private pending = false;

  private lastEv!: PointerEvent;

  constructor(dom: HTMLElement, start: Fn, move: Fn, end?: Fn) {
    this.el = dom;
    this.start = start;
    this.move = move;
    this.end = end;

    dom.addEventListener('pointerdown', this.downHandler, true);
    dom.addEventListener('pointerup', this.upHandler, true);
    dom.addEventListener('pointercancel', this.upHandler, true);
  }

  private downHandler = (ev: PointerEvent): void => {
    ev.preventDefault();
    this.el.setPointerCapture(ev.pointerId);
    this.el.addEventListener('pointermove', this.moveHandler, true);
    this.start(ev);
  };

  private moveHandler = (ev: PointerEvent): void => {
    ev.preventDefault();
    this.lastEv = ev;
    if (this.pending) return;
    this.pending = true;
    requestAnimationFrame(this.handlerMove);
  };

  private handlerMove = (): void => {
    this.move(this.lastEv);
    this.pending = false;
  };

  private upHandler = (ev: PointerEvent): void => {
    ev.preventDefault();
    this.el.releasePointerCapture(ev.pointerId);
    this.el.removeEventListener('pointermove', this.moveHandler, true);

    if (this.end) this.end(ev);
  };

  dispose(): void {
    if (!this.el) return;
    this.el.removeEventListener('pointerdown', this.downHandler, true);
    this.el.removeEventListener('pointerup', this.upHandler, true);
    this.el.removeEventListener('pointercancel', this.upHandler, true);
    this.el.removeEventListener('pointermove', this.moveHandler, true);
    this.start = null!;
    this.move = null!;
    this.end = null!;
    this.lastEv = null!;
    this.el = null!;
  }
}
