import { $ } from 'src/ts/utils';
import { ControlItem } from '..';

const spacerControlItem = (): ControlItem => ({
  id: 'spacer',
  element: $('.spacer'),
  flex(n = 0) {
    if (this.element) {
      this.element.style.flex = String(n);
    }
  },
});
spacerControlItem.id = 'spacer';
export { spacerControlItem };
