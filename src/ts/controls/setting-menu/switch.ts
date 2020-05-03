import { htmlDom, isFn } from '../../utils';

export interface SwitchOpts {
  label: string;
  defaultValue?: false;
  onChange?: (v: boolean, next: () => void) => any;
}

class Switch {
  opts: SwitchOpts;
  value: boolean;
  entry: HTMLElement;
  entryLabel: HTMLElement;
  entryValue: HTMLElement;

  constructor(opts: SwitchOpts) {
    this.opts = opts;

    this.entryLabel = htmlDom(opts.label);
    this.entryValue = document.createElement('div');
    this.entryValue.classList.add('rplayer_switch');

    this.entry = document.createElement('div');
    this.entry.classList.add('rplayer_settings_menu_item');
    this.entry.appendChild(this.entryLabel);
    this.entry.appendChild(this.entryValue);

    this.entry.addEventListener('click', this.onEntryClick, true);

    this.value = !opts.defaultValue;
    this.doSwitch();
  }

  onEntryClick = (ev: MouseEvent): void => {
    ev.preventDefault();
    ev.stopPropagation();
    if (isFn(this.opts.onChange)) {
      this.opts.onChange(!this.value, this.doSwitch);
    } else {
      this.doSwitch();
    }
  };

  doSwitch = (): void => {
    this.value = !this.value;

    if (this.value) {
      this.entryValue.classList.add('rplayer_switch-active');
    } else {
      this.entryValue.classList.remove('rplayer_switch-active');
    }
  };
}

export default Switch;
