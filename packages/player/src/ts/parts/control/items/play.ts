import {
  addDisposable, addDisposableListener, Component, hide, show,
} from 'src/ts/utils';
import { Icon } from 'src/ts/features/icons';
import { Player } from 'src/ts/player';
import { EVENT } from 'src/ts/constants';
import { I18n, PAUSE, PLAY } from 'src/ts/features/i18n';
import { Tooltip } from 'src/ts/components/tooltip';

export class PlayControlItem extends Component {
  static readonly id = 'play';

  private playIcon!: HTMLElement;

  private pauseIcon!: HTMLElement;

  readonly tip: Tooltip;

  constructor(container: HTMLElement, player: Player) {
    super(container);
    this.tip = new Tooltip(this.element);
    this.playIcon = this.element.appendChild(Icon.play());
    this.pauseIcon = this.element.appendChild(Icon.pause());

    if (player.paused) {
      this.onPause();
    } else {
      this.onPlay();
    }

    addDisposable(this, player.on(EVENT.PLAY, this.onPlay));
    addDisposable(this, player.on(EVENT.PAUSE, this.onPause));
    addDisposableListener(this, this.element, 'click', player.toggle);
  }

  private onPlay = () => {
    show(this.pauseIcon);
    hide(this.playIcon);
    this.tip.html = I18n.t(PAUSE);
  }

  private onPause = () => {
    show(this.playIcon);
    hide(this.pauseIcon);
    this.tip.html = I18n.t(PLAY);
  }
}
