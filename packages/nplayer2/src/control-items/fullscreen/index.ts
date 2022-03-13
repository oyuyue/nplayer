import type { PlayerBase } from '../../player-base';
import type { ControlItem } from '../../types';
import type { Tooltip } from '../../components';
import { EVENT, I18nKey } from '../../constants';
import { I18n } from '../../features';
import {
  addDestroyable, addDestroyableListener, Component, hide, Icon, show,
} from '../../utils';

export class Fullscreen extends Component implements ControlItem {
   id = 'fullscreen'

  tip = '1';

  tooltip!: Tooltip;

  private exitIcon!: HTMLElement;

  private enterIcon!: HTMLElement;

  onInit(player: PlayerBase) {
    this.exitIcon = this.el.appendChild(Icon.exitFullscreen());
    this.enterIcon = this.el.appendChild(Icon.enterFullscreen());

    if (player.isFullscreen) {
      this.enter();
    } else {
      this.exit();
    }

    addDestroyable(this, player.on(EVENT.ENTER_FULLSCREEN, this.enter));
    addDestroyable(this, player.on(EVENT.EXIT_FULLSCREEN, this.exit));
    addDestroyableListener(this, this.el, 'click', () => player.toggleFullscreen());
  }

  private enter = () => {
    show(this.exitIcon);
    hide(this.enterIcon);
    this.tooltip.text = I18n.t(I18nKey.EXIT_FULLSCREEN);
  }

  private exit = () => {
    hide(this.exitIcon);
    show(this.enterIcon);
    this.tooltip.text = I18n.t(I18nKey.FULLSCREEN);
  }
}
