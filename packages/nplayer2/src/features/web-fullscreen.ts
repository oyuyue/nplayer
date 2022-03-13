import { CLASS_PLAYER, EVENT } from '../constants';
import { PlayerBase } from '../player-base';
import { Destroyable } from '../types';
import { addClass, containClass, removeClass } from '../utils';

const classFull = '-web-full';

export class WebFullscreen implements Destroyable {
  private player: PlayerBase

  constructor(player: PlayerBase) {
    this.player = player;
  }

  get isActive(): boolean {
    return containClass(this.player.el, classFull, CLASS_PLAYER);
  }

  enter() {
    addClass(this.player.el, classFull, CLASS_PLAYER);
    this.player.emit(EVENT.ENTER_WEB_FULLSCREEN);
    this.player.emit(EVENT.RESIZE);
  }

  exit() {
    if (!this.isActive) return false;
    removeClass(this.player.el, classFull, CLASS_PLAYER);
    this.player.emit(EVENT.EXIT_WEB_FULLSCREEN);
    this.player.emit(EVENT.RESIZE);
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
    if (!this.player) return;
    this.player.off(EVENT.ENTER_WEB_FULLSCREEN);
    this.player.off(EVENT.EXIT_WEB_FULLSCREEN);
    this.player = null!;
  }
}
