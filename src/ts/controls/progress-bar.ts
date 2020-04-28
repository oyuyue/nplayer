import Component from '../component';
import Events from '../events';
import RPlayer from '../rplayer';
import { clamp } from '../utils';
import Bar from './bar';
import Dot from './dot';

class ProgressBar extends Component {
  barWrapper: Component;
  bufBar: Bar;
  playedBar: Bar;
  padBar: Bar;
  dot: Dot;

  barPending = false;
  barLastX = 0;

  constructor(player: RPlayer) {
    super(player, 'div', Events.BEFORE_MOUNT);

    this.addClass('rplayer_progress');

    this.barWrapper = new Component();
    this.barWrapper.addClass('rplayer_progress_bar_wrapper');
    this.bufBar = new Bar('rplayer_progress_bar rplayer_progress_buf');
    this.playedBar = new Bar('rplayer_progress_bar rplayer_progress_played');
    this.padBar = new Bar('rplayer_progress_bar rplayer_progress_pad');
    this.dot = new Dot('rplayer_progress_dot');

    this.padBar.dom.addEventListener('pointerdown', this.onPointerStart, true);
    this.padBar.dom.addEventListener('pointerup', this.onPointerEnd, true);
    this.padBar.dom.addEventListener('pointercancel', this.onPointerEnd, true);
  }

  onPointerStart = (ev: PointerEvent): void => {
    ev.preventDefault();
    this.padBar.dom.setPointerCapture(ev.pointerId);
    this.padBar.dom.addEventListener('pointermove', this.onPointerMove, true);
    this.barLastX = ev.pageX;
    this.handlePlayedBarMove();
  };

  onPointerEnd = (ev: PointerEvent): void => {
    ev.preventDefault();
    this.padBar.dom.releasePointerCapture(ev.pointerId);
    this.padBar.dom.removeEventListener(
      'pointermove',
      this.onPointerMove,
      true
    );
  };

  onPointerMove = (ev: PointerEvent): void => {
    ev.preventDefault();
    this.barLastX = ev.pageX;
    if (this.barPending) return;
    this.barPending = true;
    requestAnimationFrame(this.handlePlayedBarMove);
  };

  handlePlayedBarMove = (): void => {
    const x = this.barLastX - this.rect.x;
    this.dot.setX(clamp(x, 0, this.rect.width));
    this.playedBar.set(x / this.rect.width);
    this.barPending = false;
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
