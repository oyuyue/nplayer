import { PAUSE, PLAY } from '../../config/lang';
import Events from '../../events';
import icons from '../../icons';
import RPlayer from '../../rplayer';
import Tray from '../tray';

class PlayAction extends Tray {
  constructor(player: RPlayer) {
    super(player, Events.PLAY, Events.PAUSE);

    this.changeTipText(player.t(PLAY));
    this.setLeft();

    this.appendChild(icons.play);
    this.appendChild(icons.pause);
  }

  onClick(): void {
    this.player.toggle();
  }

  onPlay(): void {
    this.changeTipText(this.player.t(PAUSE));
  }

  onPause(): void {
    this.changeTipText(this.player.t(PLAY));
  }
}

export default PlayAction;
