import { Mask } from 'src/ts/components/mask';
import { Switch } from 'src/ts/components/switch';
import { EVENT } from 'src/ts/constants';
import { I18n, SETTINGS } from 'src/ts/features/i18n';
import { Icon } from 'src/ts/features/icons';
import { Player } from 'src/ts/player';
import {
  $, addClass, addDisposable, addDisposableListener, Component, getEventPath, measureElementSize, removeClass,
} from 'src/ts/utils';
import { ControlTip } from './helper';

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

  readonly tip: ControlTip;

  private readonly mask: Mask;

  private readonly items: SettingItem[];

  private readonly panelElement: HTMLElement;

  private readonly homeElement!: HTMLElement;

  private currentOptionElement!: HTMLElement;

  constructor(container: HTMLElement, private player: Player) {
    super(container, '.control_setting');
    this.items = player.settingItems;
    this.tip = new ControlTip(this.element, I18n.t(SETTINGS));
    this.element.appendChild(Icon.cog());
    this.mask = new Mask(this.element, this.hide, { zIndex: '1', position: 'fixed' });
    this.panelElement = this.element.appendChild($('.control_setting_panel'));
    this.panelElement.style.zIndex = '2';
    this.homeElement = this.panelElement.appendChild($());

    addDisposableListener(this, this.element, 'click', this.show);
    addDisposable(this, player.on(EVENT.MOUNTED, () => {
      const panelRect = this.panelElement.getBoundingClientRect();
      this.panelElement.style.width = `${panelRect.width}px`;
      this.panelElement.style.height = `${panelRect.height}px`;
    }));

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
        item._optionElement = this.panelElement.appendChild($());
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

    this.panelElement.style.width = `${width}px`;
    this.panelElement.style.height = `${height}px`;

    this.currentOptionElement = opt;
  }

  private showHomePage(opt: HTMLElement): void {
    opt.style.display = 'none';
    this.homeElement.style.display = '';

    const { width, height } = measureElementSize(this.homeElement);

    this.panelElement.style.width = `${width}px`;
    this.panelElement.style.height = `${height}px`;
  }

  show = (ev?: MouseEvent) => {
    if (ev && getEventPath(ev).includes(this.panelElement)) return;
    this.mask.show();
    this.tip.hide();
    this.renderHome();
    this.homeElement.style.display = '';
    addClass(this.element, classActive);
  }

  hide = (ev?: MouseEvent) => {
    if (ev) ev.stopPropagation();

    this.mask.hide();
    this.tip.show();
    removeClass(this.element, classActive);

    if (this.currentOptionElement) {
      setTimeout(() => this.showHomePage(this.currentOptionElement), 200);
    }
  }
}
