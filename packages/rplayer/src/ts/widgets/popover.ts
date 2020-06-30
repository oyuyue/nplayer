import { newElement, getDomOr, isStr } from '../utils';
import RPlayer from '..';
import Events from '../events';

export interface PopoverOptions {
  el?: string | HTMLElement;
  left?: boolean;
  player?: RPlayer;
  onHide?: () => any;
  cls?: string;
}

export default class Popover {
  private static readonly activeCls = 'rplayer_pop-active';
  private readonly player: RPlayer;
  private readonly onHide: PopoverOptions['onHide'];
  readonly dom: HTMLElement;

  constructor(opts: PopoverOptions = {}) {
    this.dom = newElement('rplayer_pop');

    if (opts.left) {
      this.dom.style.right = 'auto';
      this.dom.style.left = '0px';
    }

    if (opts.onHide) {
      this.onHide = opts.onHide;
    }

    if (opts.player) {
      this.player = opts.player;
      this.player.on(Events.CLICK_CONTROL_MASK, this.hide);
      this.player.on(Events.CLICK_OUTSIDE, this.hide);
      this.player.on(Events.PLAYER_CONTEXT_MENU, this.hide);
    }

    if (opts.cls) {
      this.dom.classList.add(opts.cls);
    }

    if (opts.el) this.mount(opts.el);
  }

  get isActive(): boolean {
    return this.dom.classList.contains(Popover.activeCls);
  }

  show(): void {
    if (this.isActive) return;
    this.dom.classList.add(Popover.activeCls);
    if (this.player) {
      this.player.controls.mask.show();
      this.player.controls.requireShow();
    }
  }

  hide = (): void => {
    this.dom.classList.remove(Popover.activeCls);
    if (this.player) {
      this.player.controls.mask.hide();
      this.player.controls.releaseShow();
      if (this.player.playing) {
        this.player.controls.hide();
      }
    }
    if (this.onHide) this.onHide();
  };

  append(d: string | HTMLElement): void {
    if (!d) return;
    if (isStr(d)) {
      this.dom.innerHTML = d;
    } else {
      this.dom.appendChild(d);
    }
  }

  mount(el?: string | HTMLElement): void {
    getDomOr(el, document.body).appendChild(this.dom);
  }
}
