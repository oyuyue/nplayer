import { Icon } from 'src/ts/features/icons';
import { Player } from 'src/ts/player';
import {
  hide, Component, addDisposableListener, show,
} from 'src/ts/utils';
import { Tooltip } from 'src/ts/components/tooltip';
import { AIRPLAY, I18n } from 'src/ts/features';

export class AirplayControlItem extends Component {
  static readonly id = 'airplay';

  readonly tip!: Tooltip;

  constructor(container: HTMLElement, player: Player) {
    super(container);

    if (!AirplayControlItem.isSupport()) {
      hide(this.element);
      return;
    }

    this.tip = new Tooltip(this.element, I18n.t(AIRPLAY));
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

  static isSupport(): boolean {
    return !!(window as any).WebKitPlaybackTargetAvailabilityEvent;
  }
}
