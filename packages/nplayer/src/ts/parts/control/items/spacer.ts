import { $ } from 'src/ts/utils';
import { ControlItem } from '..';

const spacerControlItem = (): ControlItem => ({
  id: 'spacer',
  element: $('.spacer'),
});
spacerControlItem.id = 'spacer';
export { spacerControlItem };
