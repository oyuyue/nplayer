import {
  addDisposable, addDisposableListener, Component, hide, show,
} from 'src/ts/utils';
import { Icon } from 'src/ts/features/icons';
import { Player } from 'src/ts/player';
import { EVENT } from 'src/ts/constants';
import { I18n, PAUSE, PLAY } from 'src/ts/features/i18n';
import { Tooltip } from 'src/ts/components/tooltip';
import { ControlItem } from '..';

class Play extends Component implements ControlItem {
  readonly id = 'play';

  private playIcon!: HTMLElement;

  private pauseIcon!: HTMLElement;

  tooltip!: Tooltip;

  init(player: Player, _: any, tooltip: Tooltip) {
    this.tooltip = tooltip;
    this.playIcon = this.el.appendChild(Icon.play());
    this.pauseIcon = this.el.appendChild(Icon.pause());

    if (player.paused) {
      this.onPause();
    } else {
      this.onPlay();
    }
    addDisposable(this, player.on(EVENT.PLAY, this.onPlay));
    addDisposable(this, player.on(EVENT.PAUSE, this.onPause));
    addDisposableListener(this, this.el, 'click', player.toggle);
  }

  private onPlay = () => {
    show(this.pauseIcon);
    hide(this.playIcon);
    this.tooltip.html = I18n.t(PAUSE);
  }

  private onPause = () => {
    show(this.playIcon);
    hide(this.pauseIcon);
    this.tooltip.html = I18n.t(PLAY);
  }
}

export const playControlItem = () => new Play();
