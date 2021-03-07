import { SettingItem } from '../parts/control/items/setting';

export const speedSettingItem: SettingItem = {
  id: 'speed',
  html: '播放速度',
  type: 'select',
  value: 1,
  options: [
    { value: 0.25, html: '0.25' },
    { value: 0.5, html: '0.5' },
    { value: 1, html: '正常' },
    { value: 1.5, html: '1.5' },
    { value: 2, html: '2' },
  ],
  init(p) {
    p.playbackRate = 1;
  },
  change(value, player) {
    player.playbackRate = value;
    this.value = value;
  },
};
