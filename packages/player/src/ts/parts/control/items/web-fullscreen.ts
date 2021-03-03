import { EVENT } from 'src/ts/constants';
import { icons } from 'src/ts/icons';
import { Player } from 'src/ts/player';
import {
  addDisposable, addDisposableListener, Component, hide, show,
} from 'src/ts/utils';
import { ControlTip } from './helper';

export class WebFullscreenControlItem extends Component {
  private readonly exitIcon: HTMLElement;

  private readonly enterIcon: HTMLElement;

  private readonly tip: ControlTip;

  constructor(container: HTMLElement, player: Player) {
    super(container);
    this.tip = new ControlTip(this.element);
    this.enterIcon = this.element.appendChild(icons.webEnterFullscreen());
    this.exitIcon = this.element.appendChild(icons.webExitFullscreen());

    if (player.webFullscreen.isActive) {
      this.enter();
    } else {
      this.exit();
    }

    addDisposable(this, player.on(EVENT.WEB_ENTER_FULLSCREEN, this.enter));
    addDisposable(this, player.on(EVENT.WEB_EXIT_FULLSCREEN, this.exit));
    addDisposableListener(this, this.element, 'click', player.webFullscreen.toggle);
  }

  private enter = (): void => {
    show(this.exitIcon);
    hide(this.enterIcon);
    this.tip.html = '退出网页全屏';
  }

  private exit = (): void => {
    hide(this.exitIcon);
    show(this.enterIcon);
    this.tip.html = '网页全屏';
  }
}
