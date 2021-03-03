import {
  addDisposable, addDisposableListener, Component, hide, show,
} from 'src/ts/utils';
import { icons } from 'src/ts/icons';
import { Player } from 'src/ts/player';
import { EVENT } from 'src/ts/constants';
import { ControlTip } from './helper';

export class PlayControlItem extends Component {
  private playIcon!: HTMLElement;

  private pauseIcon!: HTMLElement;

  private readonly tip: ControlTip;

  constructor(container: HTMLElement, player: Player) {
    super(container);
    this.tip = new ControlTip(this.element);
    this.playIcon = this.element.appendChild(icons.play());
    this.pauseIcon = this.element.appendChild(icons.pause());

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
    this.tip.html = '暂停';
  }

  private onPause = () => {
    show(this.playIcon);
    hide(this.pauseIcon);
    this.tip.html = '播放';
  }
}
