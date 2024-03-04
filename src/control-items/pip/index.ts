import type { PlayerBase } from '../../player-base';
import type { ControlItem } from '../../types';
import { I18nKey } from '../../constants';
import { I18n } from '../../features';
import {
  addDestroyableListener, Component, Icon,
} from '../../utils';

export class Pip extends Component implements ControlItem {
  id = 'pip';

  tipText = I18n.t(I18nKey.PIP)

  onInit(player: PlayerBase) {
    this.el.appendChild(Icon.play());
    addDestroyableListener(this, this.el, 'click', () => player.togglePIP());
  }

  isSupported() {
    return 'pictureInPictureEnabled' in document;
  }
}
