import type { Tooltip } from '../../components';
import type { ControlItem } from '../../types';
import type { PlayerBase } from '../../player-base';
import {
  addDestroyable, addDestroyableListener, Component, hide, Icon, show,
} from '../../utils';
import { I18n } from '../../features';
import { EVENT, I18nKey } from '../../constants';

export class WebFullscreen extends Component implements ControlItem {
  id = 'web-fullscreen';

  tip = '1';

  tooltip!: Tooltip;

  private exitIcon!: HTMLElement;

  private enterIcon!: HTMLElement;

  onInit(player: PlayerBase) {
    this.enterIcon = this.el.appendChild(Icon.webEnterFullscreen());
    this.exitIcon = this.el.appendChild(Icon.webExitFullscreen());
    if (player.isWebFullscreen) {
      this.enter();
    } else {
      this.exit();
    }
    addDestroyable(this, player.on(EVENT.ENTER_WEB_FULLSCREEN, this.enter));
    addDestroyable(this, player.on(EVENT.EXIT_WEB_FULLSCREEN, this.exit));
    addDestroyableListener(this, this.el, 'click', () => player.toggleWebFullscreen());
  }

  private enter = () => {
    show(this.exitIcon);
    hide(this.enterIcon);
    this.tooltip.text = I18n.t(I18nKey.EXIT_WEB_FULLSCREEN);
  }

  private exit = () => {
    hide(this.exitIcon);
    show(this.enterIcon);
    this.tooltip.text = I18n.t(I18nKey.ENTER_WEB_FULLSCREEN);
  }
}
