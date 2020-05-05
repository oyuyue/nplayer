import { EventEmitter } from 'eventemitter3';
import RPlayer from './rplayer';
declare class EventHandler extends EventEmitter {
    protected readonly player: RPlayer;
    constructor(player?: RPlayer, events?: string[]);
}
export default EventHandler;
