import Component from '../../component';
import { htmlDom, isFn } from '../../utils';

export interface RadioOption {
  label: string;
  selected?: string;
  [key: string]: any;
}

export interface RadioOpts {
  label: string;
  options: RadioOption[];
  defaultValue?: number;
  onChange?: (o: RadioOption, next: () => void) => any;
}

class Radio extends Component {
  private prevSelect: HTMLElement;
  opts: RadioOpts;
  options: HTMLElement[];
  entry: HTMLElement;
  entryLabel: HTMLElement;
  entryValue: HTMLElement;
  value: number;

  onEntryClick: (radio: Radio) => any;

  constructor(opts: RadioOpts, onEntryClick?: (radio: Radio) => any) {
    super();
    this.opts = opts;
    this.onEntryClick = onEntryClick;

    this.options = opts.options.map((o, i) => {
      const div = document.createElement('div');
      div.innerHTML = o.html || o.label;
      div.addEventListener('click', this.onOptionClick(i), true);
      div.classList.add('rplayer_settings_menu_item');
      div.classList.add('rplayer_settings_radio_option');
      return div;
    });

    this.options.forEach((o) => this.appendChild(o));

    this.value = opts.defaultValue || 0;

    this.entry = document.createElement('div');
    this.entry.classList.add('rplayer_settings_menu_radio');
    this.entry.classList.add('rplayer_settings_menu_item');
    this.entryLabel = htmlDom(opts.label);
    this.entryValue = document.createElement('span');
    this.select(this.value);

    this.entry.appendChild(this.entryLabel);
    this.entry.appendChild(this.entryValue);

    this.entry.addEventListener(
      'click',
      (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        if (isFn(this.onEntryClick)) this.onEntryClick(this);
      },
      true
    );
  }

  onOptionClick = (i: number) => (ev: MouseEvent): void => {
    ev.preventDefault();
    ev.stopPropagation();
    if (this.value === i) return;
    if (isFn(this.opts.onChange)) {
      this.opts.onChange(this.opts.options[i], this.select.bind(this, i));
    } else {
      this.select(i);
    }
  };

  select(index: number): void {
    const opt = this.options[index];
    if (!opt) return;
    if (this.prevSelect) {
      this.prevSelect.classList.remove('rplayer_settings_radio_option-active');
    }

    const select = this.opts.options[index];
    this.entryValue.innerHTML = select.selected || select.label;
    opt.classList.add('rplayer_settings_radio_option-active');
    this.value = index;
    this.prevSelect = opt;
  }
}

export default Radio;
