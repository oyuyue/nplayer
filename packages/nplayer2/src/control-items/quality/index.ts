import type { PlayerBase } from '../../player-base';
import type { ControlItem, ListItem } from '../../types';
import { EVENT } from '../../constants';
import { List } from '../../components';
import { isNumber } from '../../utils';

export class Quality extends List implements ControlItem {
  id = 'quality'

  private list!: ListItem[];

  onInit(player: PlayerBase) {
    const { qualities, qualitiesDefault } = player.config.control;
    this.setClickCb((item) => {
      player.emit(EVENT.QUALITY_CHANGE, { item, select: () => this.select(item) });
    });
    this.update(qualities, qualitiesDefault);
  }

  update(list?: ListItem[], qualitiesDefault?: number): void {
    this.list = list || [];
    super.update(this.list);
    if (qualitiesDefault != null) this.select(qualitiesDefault);
  }

  select(i: number | ListItem) {
    i = isNumber(i) ? this.list[i] : i;
    if (!i) return;
    super.select(i);
  }
}
