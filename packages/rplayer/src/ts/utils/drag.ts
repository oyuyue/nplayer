type Fn = (ev: PointerEvent) => any;

export default class Drag {
  private readonly dom: HTMLElement;
  private readonly start: Fn;
  private readonly move: Fn;
  private readonly end: Fn;
  private pending = false;
  private lastEv: PointerEvent;

  constructor(dom: HTMLElement, start: Fn, move: Fn, end?: Fn) {
    this.dom = dom;
    this.start = start;
    this.move = move;
    this.end = end;

    dom.addEventListener('pointerdown', this.downHandler, true);
    dom.addEventListener('pointerup', this.upHandler, true);
    dom.addEventListener('pointercancel', this.upHandler, true);
  }

  private downHandler = (ev: PointerEvent): void => {
    ev.preventDefault();
    this.dom.setPointerCapture(ev.pointerId);
    this.dom.addEventListener('pointermove', this.moveHandler, true);
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
    this.dom.releasePointerCapture(ev.pointerId);
    this.dom.removeEventListener('pointermove', this.moveHandler, true);

    if (this.end) this.end(ev);
  };

  destroy(): void {
    this.dom.removeEventListener('pointerdown', this.downHandler, true);
    this.dom.removeEventListener('pointerup', this.upHandler, true);
    this.dom.removeEventListener('pointercancel', this.upHandler, true);
    this.dom.removeEventListener('pointermove', this.moveHandler, true);
  }
}
