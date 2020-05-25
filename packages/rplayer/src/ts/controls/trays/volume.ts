import Component from '../../component';
import {
  ICON_MUTED,
  ICON_VOLUME,
  TRAY_VOLUME,
  TRAY_VOLUME_BAR,
  TRAY_VOLUME_BAR_WRAPPER,
  TRAY_VOLUME_DOT,
  TRAY_VOLUME_I_MUTED,
  TRAY_VOLUME_PROGRESS,
} from '../../config/classname';
import { MUTE, UNMUTE } from '../../config/lang';
import Events from '../../events';
import icons from '../../icons';
import RPlayer from '../../rplayer';
import { Drag, newElement } from '../../utils';
import Bar from '../bar';
import Dot from '../dot';
import Tray from './tray';

class Icon extends Tray {
  constructor(player: RPlayer) {
    super(player);

    this.appendChild(icons.volume(ICON_VOLUME));
    this.appendChild(icons.muted(ICON_MUTED));
    this.update();
  }

  private update(): void {
    if (this.player.muted) {
      this.addClass(TRAY_VOLUME_I_MUTED);
      this.changeTipText(this.player.t(UNMUTE));
    } else {
      this.removeClass(TRAY_VOLUME_I_MUTED);
      this.changeTipText(this.player.t(MUTE));
    }
  }

  onClick(): void {
    this.player.toggleVolume();
  }

  onVolumeChange(): void {
    if (this.player.muted && this.containsClass(TRAY_VOLUME_I_MUTED)) return;
    this.update();
  }
}

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
    this.player.volume = (ev.pageX - this.rect.left) / this.rect.width;
  };

  private dragEndHandler = (): void => {
    this.player.controls.releaseShow();
  };

  onVolumeChange(): void {
    const vol = this.player.volume;
    this.bar.setX(vol);
    this.dot.setX(this.rect.width * vol);
  }

  onMounted(): void {
    this.onVolumeChange();
  }
}

export default class VolumeTray extends Component {
  private readonly icon: Icon;
  private readonly progress: Progress;
  pos = 1;

  constructor(player: RPlayer) {
    super(player, {
      events: [Events.VOLUME_CHANGE, Events.MOUNTED],
      className: TRAY_VOLUME,
    });

    this.icon = new Icon(player);
    this.progress = new Progress(player);

    this.appendChild(this.icon);
    this.appendChild(this.progress);
  }

  onVolumeChange(): void {
    this.icon.onVolumeChange();
    this.progress.onVolumeChange();
  }

  onMounted(): void {
    this.progress.onMounted();
  }
}
