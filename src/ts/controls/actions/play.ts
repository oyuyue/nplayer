import icons from '../../icons';
import Tray from '../tray';

class PlayAction extends Tray {
  constructor() {
    super();
    this.changeTipText('播放');
    this.appendChild(icons.play);
    this.setLeft();
  }

  onClick(): void {}
}

export default PlayAction;
