import Component from '../../component';
import Events from '../../events';
import RPlayer from '../../rplayer';
import { measureElementSize, newElement } from '../../utils';
import Radio, { RadioOpts } from './radio';
import Switch, { SwitchOpts } from './switch';

class SettingMenu extends Component {
  private readonly items: (Radio | Switch)[];
  private readonly homePage: HTMLElement;
  private readonly optionPages: HTMLElement[];

  private homeRect: DOMRect;
  private readonly optionRects: { width: number; height: number }[] = [];

  constructor(player: RPlayer) {
    super(player, { events: [Events.MOUNTED] });

    this.addClass('rplayer_sets_menu');

    this.items = this.player.options.settings.map((s, i) => {
      if ((s as any).items) {
        return new Radio(s as any, this.radioEntryClickHandler(i));
      } else {
        return new Switch(s as any);
      }
    });

    this.homePage = newElement();
    this.items.forEach((item) => {
      this.homePage.appendChild(item.entry);
    });
    this.homePage.classList.add('rplayer_sets_menu_page');

    this.optionPages = this.items.map((item) => this.getOptionPage(item));

    this.appendChild(this.homePage);
    this.optionPages.forEach((page) => page && this.appendChild(page));
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

  addItem(opts: RadioOpts | SwitchOpts, i = this.items.length): Radio | Switch {
    let item: Radio | Switch;
    if (Array.isArray((opts as any).items) || (opts as any).items.length) {
      item = new Radio(opts as RadioOpts, this.radioEntryClickHandler(i));
    } else {
      item = new Switch(opts as SwitchOpts);
    }
    this.items.splice(i, 0, item);

    const optionPage = this.getOptionPage(item);
    this.optionPages.splice(i, 0, optionPage);

    this.homePage.insertBefore(item.entry, this.homePage.children[i]);
    this.appendChild(optionPage);

    return item;
  }

  resetPage(): void {
    this.optionPages.forEach((page) => {
      if (page) page.hidden = true;
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
