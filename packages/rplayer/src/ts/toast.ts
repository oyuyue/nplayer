import { newElement, isStr } from './utils';
import RPlayer from '.';

export default class Toast {
  private static readonly activeCls = 'rplayer_toast-active';
  readonly dom: HTMLElement;
  private timer: number;

  constructor(player: RPlayer) {
    this.dom = newElement('rplayer_toast');
    player.appendChild(this.dom);
  }

  private clearTimer(): void {
    clearTimeout(this.timer);
  }

  show(v: string | { message: string; duration: number }): void {
    if (!v) return;
    this.clearTimer();

    let d = 3000;
    if (isStr(v)) {
      this.dom.innerHTML = v;
    } else {
      this.dom.innerHTML = v.message;
      d = v.duration;
    }

    this.dom.classList.add(Toast.activeCls);
    if (d) setTimeout(this.hide, d);
  }

  hide = (): void => {
    this.dom.classList.remove(Toast.activeCls);
  };

  destroy(): void {
    this.clearTimer();
    if (this.dom.parentNode) {
      this.dom.parentNode.removeChild(this.dom);
    }
  }
}
