import { ClassPrefix } from '../constants';
import { Events, PlayerEvent, emit } from '../event';
import type { Player } from '../player'

const classFull = ClassPrefix + '-web-full';

export class WebFullscreen  {

  constructor(private player: Player) {}

  get isActive() {
    return this.player.el.classList.contains(classFull)
  }

  enter() {
    if (
      !this.isActive &&
      emit(Events.enterWebFullscreen, new PlayerEvent(this.player))
    ) {
      this.player.el.classList.add(classFull)
    }
  }

  exit() {
    if (
      this.isActive && 
      emit(Events.exitWebFullscreen, new PlayerEvent(this.player))
    ) {
      this.player.el.classList.remove(classFull);
    }
  }

  toggle = () => {
    if (this.isActive) {
      this.exit();
    } else {
      this.enter();
    }
  }
}
