import { EventEmitter } from 'eventemitter3';
import RPlayer from './rplayer';

class EventHandler extends EventEmitter {
  protected player: RPlayer;

  constructor(player?: RPlayer, ...events: string[]) {
    super();

    if (typeof player === 'string') {
      events.unshift(player);
    } else {
      this.player = player;
    }

    if (events && player) {
      events.forEach((evName) => {
        const fnName = 'on' + evName;
        if (typeof (this as any)[fnName] === 'function') {
          player.on(evName, (this as any)[fnName].bind(this));
        }
      });
    }
  }
}

export default EventHandler;
