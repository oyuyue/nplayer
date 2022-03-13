import { EVENT, I18nKey } from '../../constants';
import { I18n } from '../../features';
import { PlayerBase } from '../../player-base';
import { ControlItem } from '../../types';
import { addDestroyableListener, Component, Icon } from '../../utils';

export class Next extends Component implements ControlItem {
  id = 'next'

  tip = I18n.t(I18nKey.NEXT)

  onInit(player: PlayerBase) {
    this.el.appendChild(Icon.play());
    addDestroyableListener(this, this.el, 'click', () => {
      player.emit(EVENT.NEXT);
    });
  }
}
