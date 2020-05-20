import { isFn, newElement } from '../../utils';
import SettingItem from './item';

export interface RadioOption {
  label: string;
  selectedLabel?: string;
  [key: string]: any;
}

export interface RadioChangeFn {
  (o: RadioOption, update: () => void): any;
}

export interface RadioOpts {
  label: string;
  items: RadioOption[];
  checked?: number;
  onChange?: RadioChangeFn;
}

class Radio extends SettingItem {
  private prevSelect: HTMLElement;
  private value: number;
  readonly dom = newElement();

  readonly opts: RadioOpts;
  private readonly options: HTMLElement[];
  private readonly activeClass = 'rplayer_sets_radio_opt-active';

  private readonly entryClickCb: (radio: Radio) => any;

  constructor(opts: RadioOpts, entryClickCb?: (radio: Radio) => any) {
    super(opts.label);
    this.opts = opts;
    this.entryClickCb = entryClickCb;

    this.entry.classList.add('rplayer_sets_menu_radio');

    this.options = opts.items.map((o, i) => {
      const div = newElement();
      div.innerHTML = o.label;
      div.addEventListener('click', this.optionClickHandler(i), true);
      div.classList.add('rplayer_sets_menu_item');
      div.classList.add('rplayer_sets_radio_opt');
      return div;
    });
    this.options.forEach((o) => this.dom.appendChild(o));

    this.value = opts.checked || 0;
    this.select(this.value);
  }

  private optionClickHandler = (i: number) => (ev: MouseEvent): void => {
    ev.preventDefault();
    ev.stopPropagation();
    if (this.value === i) return;
    if (isFn(this.opts.onChange)) {
      this.opts.onChange(this.opts.items[i], this.select.bind(this, i));
    } else {
      this.select(i);
    }
  };

  select(index: number): void {
    const opt = this.options[index];
    if (!opt) return;
    if (this.prevSelect) {
      this.prevSelect.classList.remove(this.activeClass);
    }

    const select = this.opts.items[index];
    this.entryValue.innerHTML = select.selectedLabel || select.label;
    opt.classList.add(this.activeClass);
    this.value = index;
    this.prevSelect = opt;
  }

  onEntryClick(): void {
    if (isFn(this.entryClickCb)) this.entryClickCb(this);
  }
}

export default Radio;
