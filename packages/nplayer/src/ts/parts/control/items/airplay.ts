import { Icon } from 'src/ts/features/icons';
import { Player } from 'src/ts/player';
import {
  hide, Component, addDisposableListener, show,
} from 'src/ts/utils';
import { AIRPLAY, I18n } from 'src/ts/features';
import { ControlItem } from '..';

class Airplay extends Component implements ControlItem {
  tip = I18n.t(AIRPLAY);

  constructor(player: Player) {
    super();

    if (!this.isSupport()) {
      hide(this.element);
      return;
    }

    this.element.appendChild(Icon.airplay());

    addDisposableListener(this, player.video, 'webkitplaybacktargetavailabilitychanged' as any, (ev) => {
      if (ev.availability === 'available') {
        show(this.element);
      } else {
        hide(this.element);
      }
    });
    addDisposableListener(this, this.element, 'click', () => {
      const video = player.video as any;
      if (video && video.webkitShowPlaybackTargetPicker) {
        video.webkitShowPlaybackTargetPicker();
      }
    });
  }

  isSupport(): boolean {
    return !!(window as any).WebKitPlaybackTargetAvailabilityEvent;
  }
}

const airplayControlItem = (player: Player) => new Airplay(player);
airplayControlItem.id = 'airplay';
export { airplayControlItem };
