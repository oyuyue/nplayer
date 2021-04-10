import { I18n, LOOP } from '../features';
import { ContextMenuItem } from '../parts/contextmenu';

export const loopContextMenuItem: ContextMenuItem = {
  id: 'loop',
  html: I18n.t(LOOP),
  show(item, player) {
    item.checked = player.loop;
  },
  click(item, player) {
    item.checked = player.loop = !player.loop;
  },
};
