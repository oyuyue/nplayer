import Component from '../../component';
import { newElement } from '../../utils';
import Radio from './radio';
import Switch from './switch';

class SettingMenu extends Component {
  private readonly items: (Radio | Switch)[];
  private readonly homePage: HTMLElement;
  private readonly optionPages: HTMLElement[];

  private homeRect: DOMRect;
  private readonly optionRects: DOMRect[] = [];

  constructor() {
    super();

    this.addClass('rplayer_settings_menu');

    this.items = [
      new Switch({
        label: '自动播放',
      }),
      new Radio(
        {
          label: '字幕',
          options: [{ label: '正常' }, { label: '1正常' }, { label: '2正常' }],
        },
        this.radioEntryClickHandler(0)
      ),
      new Radio(
        { label: '速度', options: [{ label: '正常' }] },
        this.radioEntryClickHandler(1)
      ),
      new Radio(
        { label: '画质', options: [{ label: '正常' }] },
        this.radioEntryClickHandler(2)
      ),
    ];

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
      this.optionRects[i] = this.dom.getBoundingClientRect();
    }

    this.setWH(this.homeRect.width, this.homeRect.height);
    setTimeout(() => {
      this.setWH(this.optionRects[i].width, this.optionRects[i].height);
    });
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
    div.classList.add('rplayer_settings_menu_page_back');
    div.classList.add('rplayer_settings_menu_item');
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
    home.classList.add('rplayer_settings_menu_page');
    return home;
  }

  private getOptionPage(radio: Radio | Switch): HTMLElement {
    if (!(radio instanceof Radio)) return null;

    const div = newElement();
    div.classList.add('rplayer_settings_menu_page');

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

    setTimeout(() => {
      if (this.homeRect) {
        this.setWH(this.homeRect.width, this.homeRect.height);
      }
    });
    setTimeout(() => this.setWH(), 220);
  }
}

export default SettingMenu;
