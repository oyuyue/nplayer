import Component from '../component';
import RPlayer from '../rplayer';
import { newElement } from '../utils';

abstract class Tray extends Component {
  protected readonly tip = newElement();

  constructor(player?: RPlayer, ...events: string[]) {
    super(player, {
      events,
    });

    this.addClass('rplayer_tooltip rplayer_tray');
    this.tip.classList.add('rplayer_tooltip_text');

    this.dom.addEventListener('click', this.__onclick);

    this.appendChild(this.tip);
  }

  private __onclick = (ev: MouseEvent): void => {
    ev.preventDefault();
    this.onClick(ev);
  };

  abstract onClick(ev?: MouseEvent): any;

  setLeft(): void {
    this.tip.classList.add('rplayer_tooltip_text-left');
  }

  setRight(): void {
    this.tip.classList.add('rplayer_tooltip_text-right');
  }

  changeTipText(text: string): void {
    this.tip.innerText = text;
  }
}

export default Tray;
