import { EXIT_FULL_SCREEN, FULL_SCREEN } from '../../config/lang';
import Events from '../../events';
import icons from '../../icons';
import RPlayer from '../../rplayer';
import Tray from '../tray';

class FullscreenAction extends Tray {
  constructor(player: RPlayer) {
    super(player, Events.ENTER_FULLSCREEN, Events.EXIT_FULLSCREEN);

    this.changeTipText(player.t(FULL_SCREEN));
    this.setRight();

    this.appendChild(icons.enterFullscreen('rplayer_i_enter_fs'));
    this.appendChild(icons.exitFullscreen('rplayer_i_exit_fs'));
  }

  onClick(): void {
    this.player.fullscreen.toggle();
  }

  onEnterFullscreen(): void {
    this.changeTipText(this.player.t(EXIT_FULL_SCREEN));
  }

  onExitFullscreen(): void {
    this.changeTipText(this.player.t(FULL_SCREEN));
  }
}

export default FullscreenAction;
