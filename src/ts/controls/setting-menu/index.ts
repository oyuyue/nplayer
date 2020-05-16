import Component from '../../component';
import Events from '../../events';
import RPlayer from '../../rplayer';
import { measureElementSize, newElement } from '../../utils';
import Radio from './radio';
import Switch from './switch';

class SettingMenu extends Component {
  private readonly items: (Radio | Switch)[];
  private readonly homePage: HTMLElement;
  private readonly optionPages: HTMLElement[];

  private homeRect: DOMRect;
  private readonly optionRects: { width: number; height: number }[] = [];

  constructor(player: RPlayer) {
    super(player, { events: [Events.MOUNTED] });

    this.addClass('rplayer_sets_menu');

    let radioIndex = -1;
    this.items = this.player.options.settings.map((s) => {
      if ((s as any).options) {
        radioIndex++;
        return new Radio(s as any, this.radioEntryClickHandler(radioIndex));
      } else {
        return new Switch(s as any);
      }
    });

    this.homePage = this.getHomePage();
    this.optionPages = this.items
      .map((item) => this.getOptionPage(item))
      .filter((x) => x);

    this.appendChild(this.homePage);
    this.optionPages.forEach((page) => this.appendChild(page));
  }

  private radioEntryClickHandler = (i: number) => (): void => {
    if (!this.homeRect) this.homeRect = this.dom.getBoundingClientRect();

    this.homePage.hidden = true;
    this.optionPages[i].hidden = false;

    if (!this.optionRects[i]) {
      this.optionRects[i] = measureElementSize(this.optionPages[i]);
    }

    this.setWH(this.optionRects[i].width, this.optionRects[i].height);
  };

  private backClickHandler = (ev: MouseEvent): void => {
    ev.preventDefault();
    ev.stopPropagation();
    this.resetPage();
  };

  private setWH(w?: number, h?: number): void {
    this.addStyle({
      width: w ? w + 'px' : '',
      height: h ? h + 'px' : '',
    });
  }

  private getBack(html: string): HTMLElement {
    const div = newElement();
    div.classList.add('rplayer_sets_menu_page_back');
    div.classList.add('rplayer_sets_menu_item');
    div.innerHTML = html;
    div.addEventListener('click', this.backClickHandler, true);
    return div;
  }

  private getHomePage(): HTMLElement {
    if (this.homePage) return this.homePage;
    const home = newElement();
    this.items.forEach((item: any) => {
      home.appendChild(item.entry);
    });
    home.classList.add('rplayer_sets_menu_page');
    return home;
  }

  private getOptionPage(radio: Radio | Switch): HTMLElement {
    if (!(radio instanceof Radio)) return null;

    const div = newElement();
    div.classList.add('rplayer_sets_menu_page');

    const back = this.getBack(radio.opts.label);
    div.appendChild(back);
    div.appendChild(radio.dom);

    div.hidden = true;
    return div;
  }

  resetPage(): void {
    this.optionPages.forEach((opt) => {
      opt.hidden = true;
    });
    this.homePage.hidden = false;

    if (this.homeRect) {
      this.setWH(this.homeRect.width, this.homeRect.height);
    }
  }

  onMounted(): void {
    if (!this.homeRect) this.homeRect = this.dom.getBoundingClientRect();
    this.setWH(this.homeRect.width, this.homeRect.height);
  }
}

export default SettingMenu;
