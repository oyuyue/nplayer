import { htmlDom, isFn, newElement } from '../../utils';

export interface SwitchOpts {
  label: string;
  defaultValue?: false;
  onChange?: (v: boolean, next: () => void) => any;
}

class Switch {
  private value: boolean;
  private readonly opts: SwitchOpts;
  private readonly entry: HTMLElement;
  private readonly entryLabel: HTMLElement;
  private readonly entryValue: HTMLElement;

  private readonly activeClass = 'rplayer_switch-active';

  constructor(opts: SwitchOpts) {
    this.opts = opts;

    this.entryLabel = htmlDom(opts.label);
    this.entryValue = newElement();
    this.entryValue.classList.add('rplayer_switch');

    this.entry = newElement();
    this.entry.classList.add('rplayer_settings_menu_item');
    this.entry.appendChild(this.entryLabel);
    this.entry.appendChild(this.entryValue);

    this.entry.addEventListener('click', this.entryClickHandler, true);

    this.value = !opts.defaultValue;
    this.doSwitch();
  }

  private entryClickHandler = (ev: MouseEvent): void => {
    ev.preventDefault();
    ev.stopPropagation();
    if (isFn(this.opts.onChange)) {
      this.opts.onChange(!this.value, this.doSwitch);
    } else {
      this.doSwitch();
    }
  };

  private doSwitch = (): void => {
    this.value = !this.value;

    if (this.value) {
      this.entryValue.classList.add(this.activeClass);
    } else {
      this.entryValue.classList.remove(this.activeClass);
    }
  };
}

export default Switch;
