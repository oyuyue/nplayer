import { I18n, NORMAL, SPEED } from '../features';
import { SettingItem } from '../parts/control/items/setting';

export const speedSettingItem = (): SettingItem => ({
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
  init(p, item) {
    if (item.options) {
      const rate = p.playbackRate;
      for (let i = 0, l = item.options.length; i < l; i++) {
        if (item.options[i].value === rate) {
          item.value = rate;
          return;
        }
      }
    }
    p.playbackRate = 1;
  },
  change(value, player) {
    this.value = player.playbackRate = value;
  },
});
