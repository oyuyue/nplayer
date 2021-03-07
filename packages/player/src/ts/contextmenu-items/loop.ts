import { ContextMenuItem } from '../parts/contextmenu';

export const loopContextMenuItem: ContextMenuItem = {
  id: 'loop',
  html: '循环播放',
  init(item, player) {
    item.checked = player.loop;
  },
  click(item, player) {
    item.checked = player.loop = !player.loop;
  },
};
