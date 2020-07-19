import Component from '../../component';
import {
  TRAY_VOLUME,
  TRAY_VOLUME_BAR,
  TRAY_VOLUME_BAR_WRAPPER,
  TRAY_VOLUME_DOT,
  TRAY_VOLUME_PROGRESS,
} from '../../config/classname';
import { MUTE, UNMUTE } from '../../config/lang';
import Events from '../../events';
import icons from '../../icons';
import RPlayer from '../../rplayer';
import { Drag, newElement } from '../../utils';
import Bar from '../bar';
import Dot from '../dot';
import Tray from '../../widgets/tray';

class Progress extends Component {
  private readonly bar: Bar;
  private readonly dot: Dot;

  constructor(player: RPlayer) {
    super(player, { className: TRAY_VOLUME_PROGRESS });

    this.bar = new Bar(TRAY_VOLUME_BAR);
    this.dot = new Dot(TRAY_VOLUME_DOT);

    const barWrapper = newElement(TRAY_VOLUME_BAR_WRAPPER);
    barWrapper.appendChild(this.bar.dom);

    this.appendChild(barWrapper);
    this.appendChild(this.dot.dom);

    new Drag(
      this.dom,
      this.dragStartHandler,
      this.dragHandler,
      this.dragEndHandler
    );
  }

  private dragStartHandler = (ev: PointerEvent): void => {
    this.player.controls.requireShow();
    this.dragHandler(ev);
  };

  private dragHandler = (ev: PointerEvent): void => {
    this.player.volume = (ev.pageX - this.rect.left) / 60; // width
  };

  private dragEndHandler = (): void => {
    this.player.controls.releaseShow();
  };

  onVolumeChange(): void {
    const vol = this.player.volume;
    this.bar.setX(vol);
    this.dot.setX(60 * vol);
  }

  onMounted(): void {
    this.onVolumeChange();
  }
}

export default class VolumeTray extends Component {
  private readonly tray: Tray;
  private readonly progress: Progress;
  readonly pos = 1;

  constructor(player: RPlayer) {
    super(player, {
      events: [Events.VOLUME_CHANGE, Events.MOUNTED],
      className: TRAY_VOLUME,
    });

    this.tray = new Tray({
      label: player.t(MUTE),
      icons: [icons.volume(), icons.muted()],
      onClick: this.onClick,
    });
    this.progress = new Progress(player);

    this.canFocus();
    this.appendChild(this.tray.dom);
    this.appendChild(this.progress);
  }

  onClick = (): void => {
    this.player.toggleVolume();
  };

  onVolumeChange(): void {
    if (this.player.muted) {
      this.tray.changeTip(this.player.t(UNMUTE));
      this.tray.showIcon(1);
    } else {
      this.tray.changeTip(this.player.t(MUTE));
      this.tray.showIcon(0);
    }

    this.progress.onVolumeChange();
  }

  onMounted(): void {
    this.progress.onMounted();
  }
}
