import { Disposable } from 'src/ts/types';
import { addClass, Component } from 'src/ts/utils';

type Position = 'center' | 'left-top' | 'right-top' | 'left-bottom' | 'right-bottom'

export class ToastItem extends Component {
  timer!: any;

  constructor(
    container: HTMLElement,
    html: string,
    readonly position: Position = 'center',
  ) {
    super(container, '.toast');
    addClass(this.el, `toast-${position}`);
    this.el.innerHTML = html;
  }

  dispose(): void {
    super.dispose();
    clearTimeout(this.timer);
  }
}

export class Toast implements Disposable {
  private toasts: ToastItem[] = [];

  private container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  show(html: string, position?: Position, timeout = 3000): ToastItem {
    let toastItem = this.toasts.find((t) => t.position === position);

    if (toastItem) {
      clearTimeout(toastItem.timer);
      toastItem.el.innerHTML = html;
    } else {
      toastItem = new ToastItem(this.container, html, position);
      this.toasts.push(toastItem);
    }

    if (timeout > 0) {
      toastItem.timer = setTimeout(this.close.bind(this, toastItem), timeout);
    }

    return toastItem;
  }

  close(toastItem?: ToastItem): void {
    if (toastItem) {
      this.toasts = this.toasts.filter((x) => x !== toastItem);
      return toastItem.dispose();
    }

    this.toasts.forEach((item) => item.dispose());
    this.toasts = [];
  }

  dispose(): void {
    if (!this.toasts) return;
    this.close();
    this.toasts = null!;
    this.container = null!;
  }
}
