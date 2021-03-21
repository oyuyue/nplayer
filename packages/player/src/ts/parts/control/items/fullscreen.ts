import { EVENT } from 'src/ts/constants';
import { EXIT_FULL_SCREEN, FULL_SCREEN, I18n } from 'src/ts/features/i18n';
import { Icon } from 'src/ts/features/icons';
import { Player } from 'src/ts/player';
import {
  hide, Component, addDisposableListener, addDisposable, show,
} from 'src/ts/utils';
import { Tooltip } from 'src/ts/components/tooltip';

export class FullscreenControlItem extends Component {
  static readonly id = 'fullscreen';

  private readonly exitIcon: HTMLElement;

  private readonly enterIcon: HTMLElement;

  readonly tip: Tooltip;

  constructor(container: HTMLElement, player: Player) {
    super(container);
    this.tip = new Tooltip(this.element);
    this.exitIcon = this.element.appendChild(Icon.exitFullscreen());
    this.enterIcon = this.element.appendChild(Icon.enterFullscreen());

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
    this.tip.html = I18n.t(EXIT_FULL_SCREEN);
  }

  private exit = (): void => {
    hide(this.exitIcon);
    show(this.enterIcon);
    this.tip.html = I18n.t(FULL_SCREEN);
  }
}
