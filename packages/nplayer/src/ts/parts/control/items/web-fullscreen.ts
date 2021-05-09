import { EVENT } from 'src/ts/constants';
import { I18n, WEB_EXIT_FULL_SCREEN, WEB_FULL_SCREEN } from 'src/ts/features/i18n';
import { Icon } from 'src/ts/features/icons';
import { Player } from 'src/ts/player';
import {
  addDisposable, addDisposableListener, Component, hide, show,
} from 'src/ts/utils';
import { Tooltip } from 'src/ts/components/tooltip';
import { ControlItem } from '..';

class WebFullscreen extends Component implements ControlItem {
  readonly id = 'web-fullscreen'

  private exitIcon!: HTMLElement;

  private enterIcon!: HTMLElement;

  tooltip!: Tooltip;

  init(player: Player, _: any, tooltip: Tooltip) {
    this.tooltip = tooltip;
    this.enterIcon = this.el.appendChild(Icon.webEnterFullscreen());
    this.exitIcon = this.el.appendChild(Icon.webExitFullscreen());
    if (player.webFullscreen.isActive) {
      this.enter();
    } else {
      this.exit();
    }
    addDisposable(this, player.on(EVENT.WEB_ENTER_FULLSCREEN, this.enter));
    addDisposable(this, player.on(EVENT.WEB_EXIT_FULLSCREEN, this.exit));
    addDisposableListener(this, this.el, 'click', player.webFullscreen.toggle);
  }

  private enter = (): void => {
    show(this.exitIcon);
    hide(this.enterIcon);
    this.tooltip.html = I18n.t(WEB_EXIT_FULL_SCREEN);
  }

  private exit = (): void => {
    hide(this.exitIcon);
    show(this.enterIcon);
    this.tooltip.html = I18n.t(WEB_FULL_SCREEN);
  }
}

export const webFullscreenControlItem = () => new WebFullscreen();
