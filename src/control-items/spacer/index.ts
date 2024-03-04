import type { ControlItem } from '../../types';
import { $ } from '../../utils';

export class Spacer implements ControlItem {
  id = 'spacer';

  private idx = 0;

  create() {
    return {
      id: this.id + this.idx++,
      el: $('.spacer'),
    };
  }
}
