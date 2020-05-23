import { ICON_PAUSE, ICON_PLAY } from '../../config/classname';
import { PAUSE, PLAY } from '../../config/lang';
import Events from '../../events';
import icons from '../../icons';
import RPlayer from '../../rplayer';
import Tray from './tray';

export default class PlayTray extends Tray {
  constructor(player: RPlayer) {
    super(player, player.t(PLAY), Events.PLAY, Events.PAUSE);

    this.pos = 0;
    this.setLeft();
    this.appendChild(icons.play(ICON_PLAY));
    this.appendChild(icons.pause(ICON_PAUSE));
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
