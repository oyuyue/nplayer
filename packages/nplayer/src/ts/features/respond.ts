import { EVENT } from '../constants';
import { Player } from '../player';
import { Disposable } from '../types';
import { addDisposable, dispose } from '../utils';

export class Respond implements Disposable {
  isMobile = false;

  constructor(player: Player) {
    addDisposable(this, player.on(EVENT.UPDATE_SIZE, () => {
      const isM = player.rect.width <= player.opts.mobileBreakPoint;
      if (isM && !this.isMobile) {
        this.isMobile = true;
        player.emit(EVENT.ENTER_MOBILE);
      } else if (this.isMobile && !isM) {
        this.isMobile = false;
        player.emit(EVENT.EXIT_MOBILE);
      }
    }));
    addDisposable(this, player.on(EVENT.MOUNTED, () => {
      this.isMobile = player.rect.width <= player.opts.mobileBreakPoint;
      if (this.isMobile) player.emit(EVENT.ENTER_MOBILE);
    }));
  }

  dispose() {
    dispose(this);
  }
}
