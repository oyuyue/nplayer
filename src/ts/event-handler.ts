import { EventEmitter } from 'eventemitter3';
import RPlayer from './rplayer';
import { isFn, isStr } from './utils';

class EventHandler extends EventEmitter {
  protected readonly player: RPlayer;

  constructor(player?: RPlayer, events?: string[]) {
    super();

    if (player && !isStr(player)) {
      this.player = player;

      if (events) {
        events.forEach((evName) => {
          const fnName = 'on' + evName;
          if (isFn((this as any)[fnName])) {
            player.on(evName, (this as any)[fnName].bind(this));
          }
        });
      }
    }
  }
}

export default EventHandler;
