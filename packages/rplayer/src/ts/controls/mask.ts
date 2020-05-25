import { CTRL_MASK } from '../config/classname';
import Events from '../events';
import RPlayer from '../rplayer';
import { newElement } from '../utils';

export default class Mask {
  private readonly player: RPlayer;
  readonly dom: HTMLElement;

  constructor(player: RPlayer) {
    this.player = player;
    this.dom = newElement(CTRL_MASK);
    this.dom.addEventListener('click', this.clickHandler);
    this.hide();
  }

  get isActive(): boolean {
    return !this.dom.hidden;
  }

  private clickHandler = (ev: MouseEvent): void => {
    ev.preventDefault();
    ev.stopPropagation();
    this.player.emit(Events.CLICK_CONTROL_MASK);
  };

  show(): void {
    this.dom.hidden = false;
  }

  hide(): void {
    this.dom.hidden = true;
  }
}
