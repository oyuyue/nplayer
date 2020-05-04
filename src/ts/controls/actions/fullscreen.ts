import Events from '../../events';
import icons from '../../icons';
import RPlayer from '../../rplayer';
import Tray from '../tray';

class FullscreenAction extends Tray {
  constructor(player: RPlayer) {
    super(player, Events.ENTER_FULLSCREEN, Events.EXIT_FULLSCREEN);

    this.changeTipText('全屏');
    this.setRight();

    this.appendChild(icons.enterFullscreen);
    this.appendChild(icons.exitFullscreen);
  }

  onClick(): void {
    this.player.fullscreen.toggle();
  }

  onEnterFullscreen(): void {
    this.changeTipText('退出全屏');
  }

  onExitFullscreen(): void {
    this.changeTipText('全屏');
  }
}

export default FullscreenAction;
