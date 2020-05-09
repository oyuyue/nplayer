import Component from '../../component';
import RPlayer from '../../rplayer';
import FullscreenAction from './fullscreen';
import PlayAction from './play';
import SettingAction from './settings';
import TimeAction from './time';
import VolumeAction from './volume';

class Actions extends Component {
  constructor(player: RPlayer) {
    super(player);

    this.addClass('rplayer_controls_bottom_actions');

    this.appendChild(new PlayAction(player));
    this.appendChild(new VolumeAction(player));
    this.appendChild(new TimeAction(player));
    this.appendChild(new SettingAction(player));
    if (this.player.fullscreen.support) {
      this.appendChild(new FullscreenAction(player));
    }
  }

  addAction(comp: Component, pos?: number): void {
    this.insert(comp, pos);
  }
}

export default Actions;
