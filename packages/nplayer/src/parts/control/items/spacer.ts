import { $ } from 'src/ts/utils';
import { ControlItem } from '..';

export const spacerControlItem = (): ControlItem => ({
  id: 'spacer',
  el: $('.spacer'),
});
