import { Popover } from 'src/ts/components/popover';
import { Switch } from 'src/ts/components/switch';
import { EVENT } from 'src/ts/constants';
import { I18n, SETTINGS } from 'src/ts/features/i18n';
import { Icon } from 'src/ts/features/icons';
import { Player } from 'src/ts/player';
import {
  $, addClass, addDisposable, addDisposableListener, Component, getEventPath, measureElementSize, removeClass,
} from 'src/ts/utils';
import { Tooltip } from 'src/ts/components/tooltip';

export interface SettingItemOption<T = any> {
  html?: string;
  selectedHtml?: string;
  value?: T;
}

export interface SettingItem<T = any> {
  id?: string;
  html?: string;
  type?: 'switch' | 'select';
  checked?: boolean;
  options?: SettingItemOption<T>[];
  value?: T;
  init?: (player: Player, item: SettingItem) => void;
  change?: (value: T, player: Player, item: SettingItem) => void;
  _switch?: Switch;
  _selectedElement?: HTMLElement;
  _optionElements?: HTMLElement[];
  _optionElement?: HTMLElement;
  [key: string]: any;
}

export class SettingPanelOption extends Component {}

export class SettingPanelHome extends Component {}

export class SettingPanel extends Component {
  constructor(container: HTMLElement) {
    super(container, '.control_setting_panel');
  }
}

const classActive = 'control_setting-active';
const classOptionActive = 'control_setting_option-active';

export class SettingControlItem extends Component {
  static readonly id = 'settings';

  readonly tip: Tooltip;

  private readonly items: SettingItem[];

  private readonly homeElement!: HTMLElement;

  private readonly popover: Popover;

  private currentOptionElement!: HTMLElement;

  constructor(container: HTMLElement, private player: Player) {
    super(container, '.control_setting');
    this.items = player._settingItems;
    this.tip = new Tooltip(this.element, I18n.t(SETTINGS));
    this.element.appendChild(Icon.cog());

    this.popover = new Popover(this.element, this.hide, { willChange: 'width, height' });

    this.homeElement = this.popover.panelElement.appendChild($());

    this.items.forEach((item) => item.init && item.init(player, item));

    addDisposableListener(this, this.element, 'click', this.show);
    addDisposable(this, player.on(EVENT.MOUNTED, () => this.showHomePage()));

    this.renderHome();
  }

  private renderHome(): void {
    this.items.forEach((item) => {
      const el = (!item._switch && !item._selectedElement && !item._optionElement) ? $('.control_setting_item') : null;

      if (el) {
        el.appendChild($(undefined, undefined, item.html));
        if (item.type !== 'switch') el.appendChild($('.spacer'));
      }

      if (item.type === 'switch') {
        if (!item._switch) item._switch = new Switch(el!, item.checked);
      } else {
        if (!item.options || !item.options.length) return;
        if (!item._selectedElement) {
          addClass(el!, 'control_setting_item-select');
          item._selectedElement = el!.appendChild($());
        }

        const opt = item.options.find((x) => x.value === item.value);
        if (!opt) return;
        item._selectedElement.innerHTML = opt.selectedHtml || opt.html || '';
      }

      if (item._optionElement) {
        item._optionElement.style.display = 'none';
      }

      if (el) {
        el.addEventListener('click', this.onItemClick(item));
        this.homeElement.appendChild(el);
      }
    });
  }

  private renderOptions(): void {
    this.items.forEach((item) => {
      if (item.type === 'switch') return;

      if (!item._optionElement) {
        item._optionElement = this.popover.panelElement.appendChild($());
        const back = item._optionElement.appendChild($('.control_setting_item.control_setting_back'));
        back.innerHTML = item.html || '';
        back.addEventListener('click', this.back(item));
      }

      if (!item._optionElements && item.options) {
        item._optionElements = item.options.map((opt) => {
          const el = item._optionElement!.appendChild($('.control_setting_option', undefined, opt.html));
          el.addEventListener('click', this.onOptionClick(item, opt));
          return el;
        });
      }

      if (item._optionElements) {
        item._optionElements.forEach((el, i) => {
          removeClass(el, classOptionActive);
          if (item.value === item.options![i].value) {
            addClass(el, classOptionActive);
          }
        });
      }

      item._optionElement.style.display = 'none';
    });
  }

  private onItemClick = (item: SettingItem) => () => {
    if (item.type === 'switch') {
      item.checked = !item.checked;
      item._switch!.toggle(item.checked);
    } else {
      this.renderOptions();
      this.showOptionPage(item._optionElement as HTMLElement);
    }
  }

  private onOptionClick = (item: SettingItem, option: SettingItemOption) => () => {
    if (item.value !== option.value) {
      item.value = option.value;
      if (item.change) item.change(option.value, this.player, item);
    }
    this.renderHome();
    this.showHomePage(item._optionElement as HTMLElement);
  }

  private back = (item: SettingItem) => () => {
    this.showHomePage(item._optionElement as HTMLElement);
  }

  private showOptionPage(opt: HTMLElement): void {
    this.homeElement.style.display = 'none';
    opt.style.display = '';

    const { width, height } = measureElementSize(opt);

    this.popover.applyPanelStyle({
      width: `${width}px`,
      height: `${height}px`,
    });

    this.currentOptionElement = opt;
  }

  private showHomePage(opt?: HTMLElement): void {
    if (opt) opt.style.display = 'none';

    this.homeElement.style.display = '';

    const { width, height } = measureElementSize(this.homeElement);

    this.popover.applyPanelStyle({
      width: `${width}px`,
      height: `${height}px`,
    });
  }

  show = (ev?: MouseEvent) => {
    if (ev && getEventPath(ev).includes(this.popover.element)) return;
    this.tip.hide();
    this.renderHome();
    this.popover.show();
    this.homeElement.style.display = '';
    addClass(this.element, classActive);
  }

  hide = (ev?: MouseEvent) => {
    if (ev) ev.stopPropagation();

    this.tip.show();
    removeClass(this.element, classActive);

    if (this.currentOptionElement) {
      setTimeout(() => this.showHomePage(this.currentOptionElement), 200);
    }
  }
}
