import { I18n, NORMAL, SPEED } from '../features';
import { SettingItem } from '../parts/control/items/setting';

export const speedSettingItem: SettingItem = {
  id: 'speed',
  html: I18n.t(SPEED),
  type: 'select',
  value: 1,
  options: [
    { value: 0.25, html: '0.25' },
    { value: 0.5, html: '0.5' },
    { value: 1, html: I18n.t(NORMAL) },
    { value: 1.5, html: '1.5' },
    { value: 2, html: '2' },
  ],
  init(p) {
    p.playbackRate = 1;
  },
  change(value, player) {
    this.value = player.playbackRate = value;
  },
};
