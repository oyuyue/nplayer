import type { ControlItem } from '../../types';
import type { PlayerBase } from '../../player-base';
import type { Tooltip } from '../../components';
import {
  addDestroyable, addDestroyableListener, Component, hide, Icon, show,
} from '../../utils';
import { EVENT, I18nKey } from '../../constants';
import { I18n } from '../../features';
import './index.scss';

export class Play extends Component implements ControlItem {
  id = 'play';

  tipText = '1';

  tooltip!: Tooltip;

  private playIcon!: HTMLElement;

  private pauseIcon!: HTMLElement;

  private endIcon!: HTMLElement;

  onInit(player: PlayerBase) {
    this.playIcon = this.el.appendChild(Icon.play());
    this.pauseIcon = this.el.appendChild(Icon.pause());
    this.endIcon = this.el.appendChild(Icon.cog());

    if (player.paused) {
      this.onPause();
    } else {
      this.onPlay();
    }

    addDestroyable(this, player.on(EVENT.PLAY, this.onPlay));
    addDestroyable(this, player.on(EVENT.PLAY, this.onPause));
    addDestroyable(this, player.on(EVENT.ENDED, this.onEnded));
    addDestroyableListener(this, this.el, 'click', () => player.toggle());
  }

  private onPlay = () => {
    show(this.pauseIcon);
    hide(this.playIcon);
    hide(this.endIcon);
    this.tooltip.text = I18n.t(I18nKey.PAUSE);
  }

  private onPause = () => {
    show(this.playIcon);
    hide(this.pauseIcon);
    hide(this.endIcon);
    this.tooltip.text = I18n.t(I18nKey.PLAY);
  }

  private onEnded = () => {
    show(this.endIcon);
    hide(this.playIcon);
    hide(this.pauseIcon);
    this.tooltip.text = I18n.t(I18nKey.REPLAY);
  }
}
