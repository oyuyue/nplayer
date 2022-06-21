import type { PlayerBase } from '../../player-base';
import type { ControlItem } from '../../types';
import { I18nKey } from '../../constants';
import { I18n } from '../../features';
import {
  addDestroyableListener, Component, hide, Icon, show,
} from '../../utils';

export class Airplay extends Component implements ControlItem {
  id = 'airplay'

  tipText = I18n.t(I18nKey.AIRPLAY);

  onInit(player: PlayerBase) {
    this.el.appendChild(Icon.airplay());

    addDestroyableListener(this, player.media, 'webkitplaybacktargetavailabilitychanged' as any, (ev) => {
      if (ev.availability === 'available') {
        show(this.el);
      } else {
        hide(this.el);
      }
    });
    addDestroyableListener(this, this.el, 'click', () => player.enterAirplay());
  }

  isSupported() {
    return !!(window as any).WebKitPlaybackTargetAvailabilityEvent;
  }
}
