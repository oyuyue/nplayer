import { MediaSwitcher } from '../../components';
import { EVENT, I18nKey } from '../../constants';
import { I18n } from '../../features';
import { PlayerBase } from '../../player-base';
import { ControlItem } from '../../types';
import { addDestroyable, addDestroyableListener, Icon } from '../../utils';

export class Next extends MediaSwitcher implements ControlItem {
  id = 'next'

  constructor() {
    super(I18n.t(I18nKey.NEXT), Icon.play());
  }

  onInit(player: PlayerBase) {
    this.setMediaItem(player.next);
    addDestroyableListener(this, this.el, 'click', () => player.emit(EVENT.NEXT_CLICK));
    addDestroyable(this, player.on(EVENT.NEXT, () => this.setMediaItem(player.next)));
  }
}
