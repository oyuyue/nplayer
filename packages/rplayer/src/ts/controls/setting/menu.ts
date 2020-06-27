import {
  SETTING_MENU,
  SETTING_MENU_BACK,
  SETTING_ITEM,
  SETTING_MENU_PAGE,
} from '../../config/classname';
import Events from '../../events';
import RPlayer from '../../rplayer';
import { clampNeg, measureElementSize, newElement } from '../../utils';
import Select, { SelectOptions } from './select';
import Switch, { SwitchItemOptions } from './switch-item';
import Popover from '../../widgets/popover';
import EventHandler from '../../event-handler';

export default class SettingMenu extends EventHandler {
  readonly popover: Popover;
  private readonly homePage: HTMLElement;
  private readonly optionPages: HTMLElement[];
  private homeRect: { width: number; height: number };
  private readonly optionRects: { width: number; height: number }[] = [];

  constructor(player: RPlayer, onHide?: () => any) {
    super(player, [Events.MOUNTED, Events.SETTING_SELECTED]);

    this.popover = new Popover({
      player,
      onHide,
    });
    this.dom.classList.add(SETTING_MENU);

    const items = player.options.settings.map((s, i) => {
      if ((s as SelectOptions).options && (s as SelectOptions).options.length) {
        return new Select(
          player,
          s as SelectOptions,
          this.selectEntryClickHandler(i)
        );
      } else {
        return new Switch(s as SwitchItemOptions);
      }
    });

    this.homePage = newElement(SETTING_MENU_PAGE);
    items.forEach((item) => {
      this.homePage.appendChild((item as any).entry || item.dom);
    });
    this.optionPages = items.map((item) => this.getOptionPage(item));
    this.dom.appendChild(this.homePage);
    this.optionPages.forEach((page) => page && this.dom.appendChild(page));
  }

  get dom(): HTMLElement {
    return this.popover.dom;
  }

  private selectEntryClickHandler = (i: number) => (): void => {
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
    this.dom.style.width = w ? w + 'px' : '';
    this.dom.style.height = h ? h + 'px' : '';
  }

  private getBack(html: string): HTMLElement {
    const div = newElement(SETTING_ITEM);
    div.classList.add(SETTING_MENU_BACK);
    div.innerHTML = html;
    div.addEventListener('click', this.backClickHandler, true);
    return div;
  }

  private getOptionPage(select: Select | Switch): HTMLElement {
    if (!(select instanceof Select)) return null;

    const div = newElement(SETTING_MENU_PAGE);
    const back = this.getBack(select.opts.label);
    div.appendChild(back);
    div.appendChild(select.dom);

    div.hidden = true;
    return div;
  }

  show(): void {
    this.popover.show();
  }

  hide(): void {
    this.popover.hide();
  }

  addItem(
    opts: SelectOptions | SwitchItemOptions,
    pos?: number
  ): Select | Switch {
    pos = clampNeg(pos, this.homePage.children.length);

    let item: Select | Switch;
    if (
      Array.isArray((opts as SelectOptions).options) &&
      (opts as SelectOptions).options.length
    ) {
      item = new Select(
        this.player,
        opts as SelectOptions,
        this.selectEntryClickHandler(pos)
      );
    } else {
      item = new Switch(opts as SwitchItemOptions);
    }

    const optionPage = this.getOptionPage(item);
    this.optionPages.splice(pos, 0, optionPage);
    this.homePage.insertBefore(
      (item as any).entry || item.dom,
      this.homePage.children[pos]
    );
    this.dom.appendChild(optionPage);
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

  onSettingSelected(): void {
    if (!this.homePage || !this.homeRect) return;
    this.homeRect = measureElementSize(this.homePage);
  }

  onMounted(): void {
    if (!this.homeRect) this.homeRect = this.dom.getBoundingClientRect();
    this.setWH(this.homeRect.width, this.homeRect.height);
  }
}
