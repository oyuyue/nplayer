import Events from '../../events';
import icons from '../../icons';
import RPlayer from '../../rplayer';
import Tray from '../tray';

class FullscreenAction extends Tray {
  constructor(player: RPlayer) {
    super(player);

    this.changeTipText('全屏');
    this.appendChild(icons.enterFullscreen);
    this.appendChild(icons.exitFullscreen);
    this.setRight();

    this.player.on(Events.ENTER_FULLSCREEN, () => {
      this.changeTipText('退出全屏');
    });
    this.player.on(Events.EXIT_FULLSCREEN, () => {
      this.changeTipText('全屏');
    });
  }

  onClick(): void {
    this.player.fullscreen.toggle();
  }
}

export default FullscreenAction;
