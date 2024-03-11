import { ClassPrefix } from '../constants';
import { Events } from '../event';
import type { Player } from '../player'

const classFull = ClassPrefix + '-web-full';

export class WebFullscreen  {

  constructor(private player: Player) {}

  get isActive() {
    return this.player.el.classList.contains(classFull)
  }

  enter() {
    if (this.isActive) return;
    this.player.el.classList.add(classFull)
    this.player.emit(Events.EnterWebFullscreen);
  }

  exit() {
    if (!this.isActive) return;
    this.player.el.classList.remove(classFull);
    this.player.emit(Events.ExitWebFullscreen);
  }

  toggle = () => {
    if (this.isActive) {
      this.exit();
    } else {
      this.enter();
    }
  }
}
