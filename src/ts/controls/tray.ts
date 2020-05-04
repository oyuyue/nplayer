import Component from '../component';
import RPlayer from '../rplayer';
import { newElement } from '../utils';

class Tray extends Component {
  protected readonly tip = newElement();

  constructor(player?: RPlayer, ...events: string[]) {
    super({
      player,
      dom: 'button',
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onClick(ev?: MouseEvent): any {}

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
