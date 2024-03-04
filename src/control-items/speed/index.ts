import type { PlayerBase } from '../../player-base';
import type { ControlItem, ListItem } from '../../types';
import { I18nKey, EVENT } from '../../constants';
import { I18n } from '../../features';
import {
  addDestroyable,
} from '../../utils';
import { List } from '../../components';

export class Speed extends List implements ControlItem {
  id = 'speed'

  private list!: ListItem[];

  private player!: PlayerBase;

  constructor() {
    super(({ value }) => {
      this.player.playbackRate = value;
    });
  }

  onInit(player: PlayerBase) {
    this.player = player;
    this.list = player.config.control?.speeds || [
      { label: '2.0x', value: 2 },
      { label: '1.5x', value: 1.5 },
      { label: '1.25x', value: 1.25 },
      { label: '1.0x', selected: I18n.t(I18nKey.SPEED), value: 1 },
      { label: '0.75x', value: 0.75 },
      { label: '0.5x', value: 0.5 },
    ];

    this.update(this.list);

    addDestroyable(this, player.on(EVENT.RATECHANGE, this.selectItem));

    this.selectItem();
  }

  private selectItem = () => {
    const rate = this.player.playbackRate;
    let closest: ListItem | undefined;
    let v = Infinity;
    let delta = 0;
    this.list.forEach((x) => {
      delta = Math.abs(rate - x.value);
      if (v > delta) {
        closest = x;
        v = delta;
      }
    });
    if (closest) {
      this.select(closest);
    }
  }
}
