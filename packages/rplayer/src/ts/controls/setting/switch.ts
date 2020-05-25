import { SWITCH, SWITCH_ACTIVE } from '../../config/classname';
import { isFn } from '../../utils';
import SettingItem from './item';

export interface SwitchOpts {
  label: string;
  checked?: boolean;
  onChange?: (v: boolean, update: () => void, ev: MouseEvent) => any;
}

export default class Switch extends SettingItem {
  private value: boolean;
  private readonly opts: SwitchOpts;

  constructor(opts: SwitchOpts) {
    super(opts.label);
    this.opts = opts;
    this.entryValue.classList.add(SWITCH);
    this.value = !opts.checked;
    this.switch();
  }

  private switch = (): void => {
    this.value = !this.value;
    if (this.value) {
      this.entryValue.classList.add(SWITCH_ACTIVE);
    } else {
      this.entryValue.classList.remove(SWITCH_ACTIVE);
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
