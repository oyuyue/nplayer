import { EventEmitter } from 'eventemitter3';
import RPlayer from './rplayer';
export default class EventHandler extends EventEmitter {
    protected readonly player: RPlayer;
    constructor(player?: RPlayer, events?: string[]);
}
