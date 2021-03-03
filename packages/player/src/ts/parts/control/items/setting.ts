import { Mask } from 'src/ts/components/mask';
import { Switch } from 'src/ts/components/switch';
import { icons } from 'src/ts/icons';
import { Player } from 'src/ts/player';
import {
  $, addClass, addDisposableListener, Component, getEventPath, removeClass,
} from 'src/ts/utils';
import { ControlTip } from './helper';

export interface SettingItemOption {
  html?: string;
  selectedHtml?: string;
  value?: any;
}

export interface SettingItem {
  html?: string;
  type?: 'switch' | 'select';
  checked?: boolean;
  options?: SettingItemOption[];
  value?: any;
  init?: (player: Player, item: SettingItem) => void;
  change?: (option: SettingItemOption, item: SettingItem) => void;
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
  private readonly tip: ControlTip;

  private readonly mask: Mask;

  private readonly panelElement: HTMLElement;

  private readonly homeElement!: HTMLElement;

  constructor(container: HTMLElement, private readonly items: SettingItem[] = []) {
    super(container, '.control_setting');
    this.tip = new ControlTip(this.element, '设置');
    this.element.appendChild(icons.cog());
    this.mask = new Mask(this.element, this.hide, { zIndex: '1', position: 'fixed' });
    this.panelElement = this.element.appendChild($('.control_setting_panel'));
    this.panelElement.style.zIndex = '2';
    this.homeElement = this.panelElement.appendChild($());

    addDisposableListener(this, this.element, 'click', this.show);
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
        back.addEventListener('click', this.back);
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
      this.homeElement.style.display = 'none';
      if (item._optionElement) item._optionElement.style.display = '';
    }
  }

  private onOptionClick = (item: SettingItem, option: SettingItemOption) => () => {
    if (item.value !== option.value) {
      item.value = option.value;
      if (item.change) item.change(option.value, item);
    }
    this.renderHome();
    this.back();
  }

  private back = () => {
    this.homeElement.style.display = '';
    this.items.forEach((item) => {
      if (item._optionElement) {
        item._optionElement.style.display = 'none';
      }
    });
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
  }
}
