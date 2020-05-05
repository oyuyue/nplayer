import Component from '../../component';
import { htmlDom, isFn, newElement } from '../../utils';

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
  private value: number;

  readonly opts: RadioOpts;
  private readonly options: HTMLElement[];
  private readonly entry: HTMLElement;
  private readonly entryLabel: HTMLElement;
  private readonly entryValue: HTMLElement;

  private readonly onEntryClick: (radio: Radio) => any;

  constructor(opts: RadioOpts, onEntryClick?: (radio: Radio) => any) {
    super();
    this.opts = opts;
    this.onEntryClick = onEntryClick;

    this.options = opts.options.map((o, i) => {
      const div = newElement();
      div.innerHTML = o.html || o.label;
      div.addEventListener('click', this.optionClickHandler(i), true);
      div.classList.add('rplayer_settings_menu_item');
      div.classList.add('rplayer_settings_radio_option');
      return div;
    });

    this.options.forEach((o) => this.appendChild(o));

    this.value = opts.defaultValue || 0;

    this.entry = newElement();
    this.entry.classList.add('rplayer_settings_menu_radio');
    this.entry.classList.add('rplayer_settings_menu_item');
    this.entryLabel = htmlDom(opts.label);
    this.entryValue = newElement('span');

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

  private select(index: number): void {
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
