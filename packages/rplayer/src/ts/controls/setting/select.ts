import {
  SETTINGS_MENU_ITEM,
  SETTINGS_MENU_SELECT,
  SETTINGS_SELECT_OPT,
  SETTINGS_SELECT_OPT_ACTIVE,
} from '../../config/classname';
import { isFn, newElement } from '../../utils';
import SettingItem from './item';
import RPlayer from '../..';
import Events from '../../events';

export interface SelectOption {
  label: string;
  selectedLabel?: string;
  [key: string]: any;
}

export interface SelectChangeFn {
  (o: SelectOption, update: () => void): any;
}

export interface SelectOpts {
  label: string;
  options: SelectOption[];
  checked?: number;
  init?: (select: Select) => any;
  onChange?: SelectChangeFn;
}

export default class Select extends SettingItem {
  private readonly player: RPlayer;
  private prevSelect: HTMLElement;
  value = -1;
  readonly dom = newElement();
  readonly opts: SelectOpts;
  private readonly options: HTMLElement[];

  private readonly entryClickCb: (select: Select) => any;

  constructor(
    player: RPlayer,
    opts: SelectOpts,
    entryClickCb?: (select: Select) => any
  ) {
    super(opts.label);
    this.player = player;
    this.opts = opts;
    this.entryClickCb = entryClickCb;

    this.entry.classList.add(SETTINGS_MENU_SELECT);

    this.options = opts.options.map((o, i) => {
      const div = newElement(SETTINGS_MENU_ITEM);
      div.classList.add(SETTINGS_SELECT_OPT);
      div.innerHTML = o.label;
      div.addEventListener('click', this.optionClickHandler(i), true);
      return div;
    });
    this.options.forEach((o) => this.dom.appendChild(o));

    this.value = opts.checked || 0;
    this.select(this.value);

    if (opts.init) opts.init(this);
  }

  private optionClickHandler = (i: number) => (ev: MouseEvent): void => {
    ev.preventDefault();
    ev.stopPropagation();
    if (this.value === i) return;
    if (isFn(this.opts.onChange)) {
      this.opts.onChange(this.opts.options[i], this.select.bind(this, i));
    } else {
      this.select(i);
    }
  };

  select(index: number, orLabel?: string): void {
    const opt = this.options[index];
    if (this.prevSelect) {
      this.prevSelect.classList.remove(SETTINGS_SELECT_OPT_ACTIVE);
      this.prevSelect = null;
    }
    this.value = index;

    if (!opt) {
      if (orLabel) this.entryValue.innerHTML = orLabel;
      return;
    }

    const select = this.opts.options[index];
    this.entryValue.innerHTML = select.selectedLabel || select.label;
    opt.classList.add(SETTINGS_SELECT_OPT_ACTIVE);
    this.prevSelect = opt;

    this.player.emit(Events.SETTING_SELECTED, opt);
  }

  onEntryClick(): void {
    if (isFn(this.entryClickCb)) this.entryClickCb(this);
  }
}
