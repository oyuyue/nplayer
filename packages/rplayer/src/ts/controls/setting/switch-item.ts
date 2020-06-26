import BaseItem from './base-item';
import { htmlDom } from '../../utils';
import Switch from '../../widgets/switch';

export interface SwitchItemOptions {
  label?: string;
  checked?: boolean;
  onChange?: (v: boolean, update: () => void, ev: MouseEvent) => any;
}

export default class SwitchItem {
  private readonly base: BaseItem;
  private readonly switch: Switch;
  private readonly onChange: SwitchItemOptions['onChange'];

  constructor(opts: SwitchItemOptions = {}) {
    this.onChange = opts.onChange;

    this.base = new BaseItem({
      onClick: this.onClick,
    });

    this.switch = new Switch({
      defaultValue: opts.checked,
    });

    this.base.append(htmlDom(opts.label));
    this.base.append(this.switch.dom);
  }

  get dom(): HTMLElement {
    return this.base.dom;
  }

  private onClick = (ev: MouseEvent): void => {
    if (this.onChange) {
      this.onChange(!this.switch.value, this.update, ev);
    } else {
      this.update();
    }
  };

  private update = (): void => {
    this.switch.update(!this.switch.value);
  };
}
