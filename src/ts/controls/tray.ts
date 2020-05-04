import Component from '../component';
import RPlayer from '../rplayer';

class Tray extends Component {
  protected tipComp = new Component();

  constructor(player?: RPlayer, ...events: string[]) {
    super(player, 'button', ...events);
    this.addClass('rplayer_tooltip rplayer_tray');
    this.tipComp.addClass('rplayer_tooltip_text');
    this.appendChild(this.tipComp);
    this.addClickListener();
  }

  private __onclick = (ev: MouseEvent): any => {
    ev.preventDefault();
    return this.onClick(ev);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onClick(ev: MouseEvent): any {}

  setLeft(): void {
    this.tipComp.addClass('rplayer_tooltip_text-left');
  }

  setRight(): void {
    this.tipComp.addClass('rplayer_tooltip_text-right');
  }

  changeTipText(text: string): void {
    this.tipComp.text = text;
  }

  addClickListener(): void {
    this.dom.addEventListener('click', this.__onclick);
  }

  removeClickListener(): void {
    this.dom.removeEventListener('click', this.__onclick);
  }
}

export default Tray;
