import type { Player } from '../player'
import { isFunction } from '../utils';
import { Events, UnCancellableEvent } from '../event'
import { isBrowser, isIOS } from '../env'

const prefix = isBrowser ? getPrefix() : ''

export class Fullscreen {
  private target!: HTMLElement;

  constructor(private player: Player) {
    document.addEventListener(prefix, this.onFullscreen)
    this.target = isIOS ? this.player.media : this.player.el;
    if (this.isActive) this.enter();
  }

  private onFullscreen = () => {
    this.player.emit(
      this.isActive ? Events.enterFullscreen : Events.exitFullscreen, 
      new UnCancellableEvent(this.player)
    );
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
    const p = (Document || HTMLDocument).prototype;
    return (
      p.exitFullscreen
      || (p as any).webkitExitFullscreen
      || (p as any).cancelFullScreen
      || (p as any).mozCancelFullScreen
      || (p as any).msExitFullscreen
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

  get isActive() {
    return this.fullscreenElement === this.target;
  }

  enter() {
    if (isIOS) {
      (this.target as any).webkitEnterFullscreen();
    } else {
      this.requestFullscreen.call(this.target, { navigationUI: 'hide' });
    }
  }

  exit() {
    if (!this.isActive) return false;
    if (isIOS) {
      (this.target as any).webkitExitFullscreen();
    } else {
      this.exitFullscreen.call(document);
    }
    return true;
  }

  toggle = () => {
    if (this.isActive) {
      this.exit();
    } else {
      this.enter();
    }
  }

  destroy() {
    document.removeEventListener(prefix, this.onFullscreen)
  }
}

function getPrefix() {
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

  return prefix === 'ms' ? 'MSFullscreenChange' : `${prefix}fullscreenchange`
}
