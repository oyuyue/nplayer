import { EVENT } from 'src/ts/constants';
import { Icon } from 'src/ts/features';
import { Player } from 'src/ts/player';
import {
  addDisposable, addDisposableListener, Component, hide, show,
} from 'src/ts/utils';

export class Poster extends Component {
  private playElement: HTMLElement;

  private poster: string;

  private tryToPlayed = false;

  constructor(container: HTMLElement, private player: Player) {
    super(container, '.poster');
    this.poster = player.opts.poster;
    this.playElement = player.opts.posterPlayElement || Icon.play('poster_play');
    this.element.appendChild(this.playElement);
    this.hide();

    if (!player.opts.posterEnable) return;

    this.show();
    if (this.poster) {
      this.applyStyle({
        backgroundImage: `url(${this.poster})`,
      });
    }

    addDisposableListener(this, this.element, 'click', () => {
      if (this.tryToPlayed) return;
      this.tryToPlayed = true;
      if (player.loaded) {
        this.hide();
      } else {
        hide(this.playElement);
        player.loading.show();
      }
      player.play();
    });

    addDisposable(this, player.on(EVENT.CANPLAY, this.tryHide));
    addDisposable(this, player.on(EVENT.LOADED_METADATA, this.tryHide));
    addDisposable(this, player.on(EVENT.UPDATE_OPTIONS, () => {
      if (player.opts.poster && player.opts.poster !== this.poster && !player.loaded) {
        this.tryToPlayed = false;
        this.addTimeUpdateHandler();
        this.show();
      }
    }));

    this.addTimeUpdateHandler();
  }

  private addTimeUpdateHandler() {
    this.player.off(EVENT.TIME_UPDATE, this.onTimeUpdate);
    this.player.on(EVENT.TIME_UPDATE, this.onTimeUpdate);
  }

  private onTimeUpdate = () => {
    if (this.player.playing) {
      this.tryToPlayed = true;
      this.hide();
      this.player.off(EVENT.TIME_UPDATE, this.onTimeUpdate);
    }
  }

  private tryHide = () => {
    if (!this.tryToPlayed) return;
    this.hide();
  }

  get isActive(): boolean {
    return this.element.style.display !== 'none';
  }

  show() {
    show(this.element);
    show(this.playElement);
  }

  hide() {
    hide(this.element);
  }
}
