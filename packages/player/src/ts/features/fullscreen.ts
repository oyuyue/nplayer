import { EVENT } from '../constants';
import { Player } from '../player';
import { Disposable } from '../types';
import {
  addClass, addDisposableListener, dispose, isFunction, isIOS, removeClass,
} from '../utils';

const CLASS_FULL = 'full';

export class Fullscreen implements Disposable {
  private target!: HTMLElement;

  private readonly prefix = this.getPrefix();

  constructor(private player: Player) {
    addDisposableListener(this, document, this.prefix === 'ms' ? 'MSFullscreenChange' : `${this.prefix}fullscreenchange` as any, () => {
      let evt = '';
      if (this.isActive) {
        this.addClass();
        evt = EVENT.ENTER_FULLSCREEN;
      } else {
        this.removeClass();
        evt = EVENT.EXIT_FULLSCREEN;
      }
      this.player.emit(evt);
    });

    addDisposableListener(this, player.element, 'dblclick', (ev: MouseEvent) => {
      ev.preventDefault();
      this.toggle();
    });

    this.setTarget();
    if (this.isActive) this.addClass();
  }

  private getPrefix(): string {
    if (isFunction(document.exitFullscreen)) return '';

    let prefix = '';
    ['webkit', 'moz', 'ms'].forEach((p) => {
      if (
        isFunction((document as any)[`${p}ExitFullscreen`])
        || isFunction((document as any)[`${p}CancelFullScreen`])
      ) {
        prefix = p;
      }
    });

    return prefix;
  }

  get requestFullscreen(): Element['requestFullscreen'] {
    return (
      HTMLElement.prototype.requestFullscreen
      || (HTMLElement.prototype as any).webkitRequestFullscreen
      || (HTMLElement.prototype as any).mozRequestFullScreen
      || (HTMLElement.prototype as any).msRequestFullscreen
    );
  }

  get exitFullscreen(): Document['exitFullscreen'] {
    return (
      HTMLDocument.prototype.exitFullscreen
      || (HTMLDocument.prototype as any).webkitExitFullscreen
      || (HTMLDocument.prototype as any).cancelFullScreen
      || (HTMLDocument.prototype as any).mozCancelFullScreen
      || (HTMLDocument.prototype as any).msExitFullscreen
    );
  }

  get fullscreenElement(): HTMLElement {
    return (
      document.fullscreenElement
      || (document as any).mozFullScreenElement
      || (document as any).msFullscreenElement
      || (document as any).webkitFullscreenElement
    );
  }

  get isActive(): boolean {
    return this.fullscreenElement === this.target;
  }

  private addClass(): void {
    addClass(this.player.element, CLASS_FULL);
  }

  private removeClass(): void {
    removeClass(this.player.element, CLASS_FULL);
  }

  setTarget(dom?: HTMLElement, video?: HTMLVideoElement): void {
    this.target = (dom && isIOS ? video : dom) || (isIOS ? this.player.video : this.player.element);
    if (this.isActive) this.enter();
  }

  enter(): void {
    if (isIOS) {
      (this.target as any).webkitEnterFullscreen();
    } else {
      this.requestFullscreen.call(this.target, { navigationUI: 'hide' });
    }
  }

  exit(): void {
    if (isIOS) {
      (this.target as any).webkitExitFullscreen();
    } else {
      this.exitFullscreen.call(document);
    }
  }

  toggle(): void {
    if (this.isActive) {
      this.exit();
    } else {
      this.enter();
    }
  }

  dispose(): void {
    if (!this.player) return;
    this.player = null!;
    dispose(this);
  }
}
