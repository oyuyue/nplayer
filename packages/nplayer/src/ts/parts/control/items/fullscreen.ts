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
  private readonly exitIcon: HTMLElement;

  private readonly enterIcon: HTMLElement;

  tooltip!: Tooltip;

  constructor() {
    super();
    this.exitIcon = this.element.appendChild(Icon.exitFullscreen());
    this.enterIcon = this.element.appendChild(Icon.enterFullscreen());
  }

  init(player: Player, tooltip: Tooltip) {
    this.tooltip = tooltip;
    if (player.fullscreen.isActive) {
      this.enter();
    } else {
      this.exit();
    }

    addDisposable(this, player.on(EVENT.ENTER_FULLSCREEN, this.enter));
    addDisposable(this, player.on(EVENT.EXIT_FULLSCREEN, this.exit));
    addDisposableListener(this, this.element, 'click', player.fullscreen.toggle);
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

const fullscreenControlItem = () => new Fullscreen();
fullscreenControlItem.id = 'fullscreen';
export { fullscreenControlItem };
