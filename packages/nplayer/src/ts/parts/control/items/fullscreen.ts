import { EVENT } from 'src/ts/constants';
import { EXIT_FULL_SCREEN, FULL_SCREEN, I18n } from 'src/ts/features/i18n';
import { Icon } from 'src/ts/features/icons';
import { Player } from 'src/ts/player';
import {
  hide, Component, addDisposableListener, addDisposable, show,
} from 'src/ts/utils';
import { Tooltip } from 'src/ts/components/tooltip';
import { ControlItem } from '..';

class Fullscreen extends Component implements ControlItem {
  readonly id = 'fullscreen'

  private exitIcon!: HTMLElement;

  private enterIcon!: HTMLElement;

  tooltip!: Tooltip;

  init(player: Player, _: any, tooltip: Tooltip) {
    this.tooltip = tooltip;
    this.exitIcon = this.el.appendChild(Icon.exitFullscreen());
    this.enterIcon = this.el.appendChild(Icon.enterFullscreen());
    if (player.fullscreen.isActive) {
      this.enter();
    } else {
      this.exit();
    }

    addDisposable(this, player.on(EVENT.ENTER_FULLSCREEN, this.enter));
    addDisposable(this, player.on(EVENT.EXIT_FULLSCREEN, this.exit));
    addDisposableListener(this, this.el, 'click', player.fullscreen.toggle);
  }

  private enter = (): void => {
    show(this.exitIcon);
    hide(this.enterIcon);
    this.tooltip.html = I18n.t(EXIT_FULL_SCREEN);
  }

  private exit = (): void => {
    hide(this.exitIcon);
    show(this.enterIcon);
    this.tooltip.html = I18n.t(FULL_SCREEN);
  }
}

export const fullscreenControlItem = () => new Fullscreen();
