type Fn = (ev: PointerEvent) => any;

class Drag {
  dom: HTMLElement;
  start: Fn;
  move: Fn;
  end: Fn;
  pending = false;
  lastEv: PointerEvent;

  constructor(dom: HTMLElement, start: Fn, move: Fn, end?: Fn) {
    this.dom = dom;
    this.start = start;
    this.move = move;
    this.end = end;

    dom.addEventListener('pointerdown', this.onDown, true);
    dom.addEventListener('pointerup', this.onUp, true);
    dom.addEventListener('pointercancel', this.onUp, true);
  }

  private onDown = (ev: PointerEvent): void => {
    ev.preventDefault();
    this.dom.setPointerCapture(ev.pointerId);
    this.dom.addEventListener('pointermove', this.onMove, true);
    this.start(ev);
  };

  private onMove = (ev: PointerEvent): void => {
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

  private onUp = (ev: PointerEvent): void => {
    ev.preventDefault();
    this.dom.releasePointerCapture(ev.pointerId);
    this.dom.removeEventListener('pointermove', this.onMove, true);

    if (this.end) this.end(ev);
  };

  close(): void {
    this.dom.removeEventListener('pointerdown', this.onDown, true);
    this.dom.removeEventListener('pointerup', this.onUp, true);
    this.dom.removeEventListener('pointercancel', this.onUp, true);
    this.dom.removeEventListener('pointermove', this.onMove, true);
  }
}

export default Drag;
