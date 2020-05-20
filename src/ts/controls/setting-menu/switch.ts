import { isFn } from '../../utils';
import SettingItem from './item';

export interface SwitchOpts {
  label: string;
  checked?: boolean;
  onChange?: (v: boolean, update: () => void, ev: MouseEvent) => any;
}

class Switch extends SettingItem {
  private value: boolean;
  private readonly opts: SwitchOpts;
  private readonly activeClass = 'rplayer_switch-active';

  constructor(opts: SwitchOpts) {
    super(opts.label);
    this.opts = opts;
    this.entryValue.classList.add('rplayer_switch');
    this.value = !opts.checked;
    this.switch();
  }

  private switch = (): void => {
    this.value = !this.value;
    if (this.value) {
      this.entryValue.classList.add(this.activeClass);
    } else {
      this.entryValue.classList.remove(this.activeClass);
    }
  };

  onEntryClick(ev: MouseEvent): void {
    if (isFn(this.opts.onChange)) {
      this.opts.onChange(!this.value, this.switch, ev);
    } else {
      this.switch();
    }
  }
}

export default Switch;
