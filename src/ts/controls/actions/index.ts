import Component from '../../component';
import RPlayer from '../../rplayer';
import FullscreenAction from './fullscreen';
import PlayAction from './play';
import SettingAction from './settings';
import TimeAction from './time';

class Actions extends Component {
  constructor(player: RPlayer) {
    super(player);

    this.addClass('rplayer_controls_bottom_actions');

    this.appendChild(new PlayAction());
    this.appendChild(new TimeAction(this.player));
    this.appendChild(new SettingAction());
    this.appendChild(new FullscreenAction(this.player));
  }

  addAction(comp: Component, pos?: number): void {
    this.insert(comp, pos);
  }
}

export default Actions;
