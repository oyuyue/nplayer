import Component from '../component';
import Events from '../events';
import RPlayer from '../rplayer';
import { clamp, Drag } from '../utils';
import Bar from './bar';
import Dot from './dot';

class ProgressBar extends Component {
  barWrapper: Component;
  bufBar: Bar;
  playedBar: Bar;
  padBar: Bar;
  dot: Dot;

  drag: Drag;

  constructor(player: RPlayer) {
    super(player, 'div', Events.BEFORE_MOUNT);

    this.addClass('rplayer_progress');

    this.barWrapper = new Component();
    this.barWrapper.addClass('rplayer_progress_bar_wrapper');
    this.bufBar = new Bar('rplayer_progress_bar rplayer_progress_buf');
    this.playedBar = new Bar('rplayer_progress_bar rplayer_progress_played');
    this.padBar = new Bar('rplayer_progress_bar rplayer_progress_pad');
    this.dot = new Dot('rplayer_progress_dot');

    this.drag = new Drag(this.padBar.dom, this.onDrag, this.onDrag);
  }

  onDrag = (ev: PointerEvent): void => {
    const x = ev.pageX - this.rect.x;
    this.dot.setX(clamp(x, 0, this.rect.width));
    this.playedBar.set(x / this.rect.width);
  };

  onBeforeMount(): void {
    this.barWrapper.appendChild(this.bufBar);
    this.barWrapper.appendChild(this.playedBar);
    this.barWrapper.appendChild(this.padBar);
    this.appendChild(this.barWrapper);
    this.appendChild(this.dot);
    this.player.controls.bottom.appendChild(this);
  }
}

export default ProgressBar;
