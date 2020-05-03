import icons from '../../icons';
import Tray from '../tray';

class Fullscreen extends Tray {
  constructor() {
    super();
    this.changeTipText('全屏');
    this.appendChild(icons.enterFullscreen);
    this.setRight();
  }
}

export default Fullscreen;
