import type { PlayerBase } from '../../player-base';
import type { ControlItem } from '../../types';
import { I18nKey } from '../../constants';
import { I18n } from '../../features';
import {
  addDestroyableListener, Component, hide, Icon,
} from '../../utils';

export class Pip extends Component implements ControlItem {
  id = 'pip';

  tip = I18n.t(I18nKey.PIP)

  onInit(player: PlayerBase) {
    if ('pictureInPictureEnabled' in document) {
      this.el.appendChild(Icon.play());
      addDestroyableListener(this, this.el, 'click', () => player.togglePIP());
    } else {
      hide(this.el);
    }
  }
}
