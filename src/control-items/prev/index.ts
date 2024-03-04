import { MediaSwitcher } from '../../components';
import { EVENT, I18nKey } from '../../constants';
import { I18n } from '../../features';
import { PlayerBase } from '../../player-base';
import { ControlItem } from '../../types';
import { addDestroyable, addDestroyableListener, Icon } from '../../utils';

export class Prev extends MediaSwitcher implements ControlItem {
  id = 'prev'

  constructor() {
    super(I18n.t(I18nKey.PREV), Icon.play());
  }

  onInit(player: PlayerBase) {
    this.setMediaItem(player.prev);
    addDestroyableListener(this, this.el, 'click', () => player.emit(EVENT.PREV_CLICK));
    addDestroyable(this, player.on(EVENT.PREV, () => this.setMediaItem(player.prev)));
  }
}
