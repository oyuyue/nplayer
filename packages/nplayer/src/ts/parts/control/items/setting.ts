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
import { ControlItem } from '..';

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
  _selectedEl?: HTMLElement;
  _optionEls?: HTMLElement[];
  _optionEl?: HTMLElement;
  [key: string]: any;
}

export class SettingPanel extends Component {
  constructor(container: HTMLElement) {
    super(container, '.control_setting_panel');
  }
}

const classActive = 'control_setting-active';
const classOptionActive = 'control_setting_option-active';

class Setting extends Component implements ControlItem {
  readonly id = 'settings';

  private player!: Player;

  private items!: SettingItem[];

  private homeEl!: HTMLElement;

  private popover!: Popover;

  private currentOptionEl!: HTMLElement;

  private probeEl!: HTMLElement;

  tooltip!: Tooltip;

  tip = I18n.t(SETTINGS);

  init(player: Player, position: number, tooltip: Tooltip) {
    this.player = player;
    this.tooltip = tooltip;
    addClass(this.el, 'control_setting');
    this.items = player.__settingItems;
    this.el.appendChild(Icon.cog());
    this.popover = new Popover(this.el, this.hide, { willChange: 'width, height' });
    this.homeEl = this.popover.panelEl.appendChild($());

    this.probeEl = this.el.appendChild($());
    const probeElStyle = this.probeEl.style;
    probeElStyle.position = 'absolute';
    probeElStyle.zIndex = '-9';
    probeElStyle.width = '2px';
    probeElStyle.height = '1px';
    probeElStyle.opacity = '0';

    this.setPos(position);

    addDisposableListener(this, this.el, 'click', this.show);
    addDisposable(this, player.on(EVENT.MOUNTED, () => this.showHomePage()));
    this.items.forEach((item) => item.init && item.init(player, item));
    this.renderHome();
  }

  update(position: number): void {
    this.setPos(position);
  }

  private setPos(position: number): void {
    this.popover.resetPos();
    if (position === 2) this.popover.setBottom();
  }

  private renderHome(): void {
    this.items.forEach((item) => {
      const el = (!item._switch && !item._selectedEl && !item._optionEl) ? $('.control_setting_item') : null;

      if (el) {
        el.appendChild($(undefined, undefined, item.html));
        if (item.type !== 'switch') el.appendChild($('.spacer'));
      }

      if (item.type === 'switch') {
        if (!item._switch) item._switch = new Switch(el!, item.checked);
      } else {
        if (!item.options || !item.options.length) return;
        if (!item._selectedEl) {
          addClass(el!, 'control_setting_item-select');
          item._selectedEl = el!.appendChild($());
        }

        const opt = item.options.find((x) => x.value === item.value);
        if (!opt) return;
        item._selectedEl.innerHTML = opt.selectedHtml || opt.html || '';
      }

      if (item._optionEl) {
        item._optionEl.style.display = 'none';
      }

      if (el) {
        el.addEventListener('click', this.onItemClick(item));
        this.homeEl.appendChild(el);
      }
    });
  }

  private renderOptions(): void {
    this.items.forEach((item) => {
      if (item.type === 'switch') return;

      if (!item._optionEl) {
        item._optionEl = this.popover.panelEl.appendChild($());
        const back = item._optionEl.appendChild($('.control_setting_item.control_setting_back'));
        back.innerHTML = item.html || '';
        back.addEventListener('click', this.back(item));
      }

      if (!item._optionEls && item.options) {
        item._optionEls = item.options.map((opt) => {
          const el = item._optionEl!.appendChild($('.control_setting_option', undefined, opt.html));
          el.addEventListener('click', this.onOptionClick(item, opt));
          return el;
        });
      }

      if (item._optionEls) {
        item._optionEls.forEach((el, i) => {
          removeClass(el, classOptionActive);
          if (item.value === item.options![i].value) {
            addClass(el, classOptionActive);
          }
        });
      }

      item._optionEl.style.display = 'none';
    });
  }

  private onItemClick = (item: SettingItem) => () => {
    if (item.type === 'switch') {
      item.checked = !item.checked;
      item._switch!.toggle(item.checked);
      if (item.change) item.change(item.checked, this.player, item);
    } else {
      this.renderOptions();
      this.showOptionPage(item._optionEl as HTMLElement);
    }
  }

  private onOptionClick = (item: SettingItem, option: SettingItemOption) => () => {
    if (item.value !== option.value) {
      item.value = option.value;
      if (item.change) item.change(option.value, this.player, item);
    }
    this.renderHome();
    this.showHomePage(item._optionEl as HTMLElement);
  }

  private back = (item: SettingItem) => () => {
    this.showHomePage(item._optionEl as HTMLElement);
  }

  private showOptionPage(opt: HTMLElement): void {
    this.homeEl.style.display = 'none';
    opt.style.display = '';

    const { width, height } = measureElementSize(opt);

    const { width: w, height: h } = this.probeEl.getBoundingClientRect();
    const hGtw = h > w;

    this.popover.applyPanelStyle({
      width: `${hGtw ? height : width}px`,
      height: `${hGtw ? width : height}px`,
    });

    this.currentOptionEl = opt;
  }

  private showHomePage(opt?: HTMLElement): void {
    if (opt) opt.style.display = 'none';

    this.homeEl.style.display = '';

    const { width, height } = measureElementSize(this.homeEl);

    const { width: w, height: h } = this.probeEl.getBoundingClientRect();
    const hGtw = h > w;

    this.popover.applyPanelStyle({
      width: `${hGtw ? height : width}px`,
      height: `${hGtw ? width : height}px`,
    });
  }

  show = (ev?: MouseEvent) => {
    if (ev && getEventPath(ev).includes(this.popover.el)) return;
    this.tooltip.hide();
    this.renderHome();
    this.popover.show();
    this.homeEl.style.display = '';
    addClass(this.el, classActive);
  }

  hide = (ev?: MouseEvent) => {
    if (ev) ev.stopPropagation();

    this.tooltip.show();
    removeClass(this.el, classActive);

    if (this.currentOptionEl) {
      setTimeout(() => this.showHomePage(this.currentOptionEl), 200);
    }
  }
}

export const settingControlItem = () => new Setting();
