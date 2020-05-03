import Events from './events';
import RPlayer from './rplayer';
import { isFn, ua } from './utils';

class Fullscreen {
  player: RPlayer;
  prefix = this.getPrefix();

  constructor(player: RPlayer) {
    this.player = player;

    (document as any).addEventListener(
      this.prefix === 'ms'
        ? 'MSFullscreenChange'
        : `${this.prefix}fullscreenchange`,
      this.onChange,
      true
    );
  }

  private onChange = (ev: Event): void => {
    ev.preventDefault();

    this.player.emit(
      this.isActive ? Events.ENTER_FULLSCREEN : Events.EXIT_FULLSCREEN
    );
  };

  getPrefix(): string {
    if (isFn(document.exitFullscreen)) return '';

    let prefix = '';
    ['webkit', 'moz', 'ms'].forEach((p) => {
      if (
        isFn((document as any)[`${p}ExitFullscreen`]) ||
        isFn((document as any)[`${p}CancelFullScreen`])
      ) {
        prefix = p;
      }
    });

    return prefix;
  }

  get requestFullscreen(): Function {
    return (
      HTMLElement.prototype.requestFullscreen ||
      (HTMLElement.prototype as any).webkitRequestFullscreen ||
      (HTMLElement.prototype as any).mozRequestFullScreen ||
      (HTMLElement.prototype as any).msRequestFullscreen
    );
  }

  get exitFullscreen(): Function {
    return (
      HTMLDocument.prototype.exitFullscreen ||
      (HTMLDocument.prototype as any).webkitExitFullscreen ||
      (HTMLDocument.prototype as any).cancelFullScreen ||
      (HTMLDocument.prototype as any).mozCancelFullScreen ||
      (HTMLDocument.prototype as any).msExitFullscreen
    );
  }

  get fullscreenElement(): HTMLElement {
    return (
      (document as any).mozFullScreenElement ||
      (document as any).msFullscreenElement ||
      (document as any).webkitFullscreenElement
    );
  }

  get target(): HTMLElement {
    return ua.isIos ? this.player.media : this.player.dom;
  }

  get isActive(): boolean {
    return this.fullscreenElement === this.target;
  }

  enter(): void {
    if (ua.isIos) {
      (this.target as any).webkitEnterFullscreen();
    } else {
      this.requestFullscreen.call(this.target, { navigationUI: 'hide' });
    }
  }

  exit(): void {
    if (ua.isIos) {
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
}

export default Fullscreen;
