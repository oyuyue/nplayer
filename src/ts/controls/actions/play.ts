import Events from '../../events';
import icons from '../../icons';
import RPlayer from '../../rplayer';
import Tray from '../tray';

class PlayAction extends Tray {
  constructor(player: RPlayer) {
    super(player, Events.PLAY, Events.PAUSE);

    this.changeTipText('播放');
    this.setLeft();

    this.appendChild(icons.play);
    this.appendChild(icons.pause);
  }

  onClick(): void {
    this.player.toggle();
  }

  onPlay(): void {
    this.changeTipText('暂停');
  }

  onPause(): void {
    this.changeTipText('播放');
  }
}

export default PlayAction;
