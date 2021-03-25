import { CLASS_PLAYER, EVENT } from '../constants';
import { Player } from '../player';
import { Disposable } from '../types';
import { addClass, containClass, removeClass } from '../utils';

const classFull = '-web-full';

export class WebFullscreen implements Disposable {
  private player: Player

  constructor(player: Player) {
    this.player = player;
  }

  get isActive(): boolean {
    return containClass(this.player.element, classFull, CLASS_PLAYER);
  }

  enter(): void {
    addClass(this.player.element, classFull, CLASS_PLAYER);
    this.player.emit(EVENT.WEB_ENTER_FULLSCREEN);
  }

  exit(): boolean {
    if (!this.isActive) return false;
    removeClass(this.player.element, classFull, CLASS_PLAYER);
    this.player.emit(EVENT.WEB_EXIT_FULLSCREEN);
    return true;
  }

  toggle = (): void => {
    if (this.isActive) {
      this.exit();
    } else {
      this.enter();
    }
  }

  dispose(): void {
    if (!this.player) return;
    this.player.off(EVENT.WEB_ENTER_FULLSCREEN);
    this.player.off(EVENT.WEB_EXIT_FULLSCREEN);
    this.player = null!;
  }
}
