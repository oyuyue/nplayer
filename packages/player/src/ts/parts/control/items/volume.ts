import { EVENT } from 'src/ts/constants';
import { icons } from 'src/ts/icons';
import { Player } from 'src/ts/player';
import {
  $, addDisposable, addDisposableListener, clamp, Component, Drag, getEventPath, hide, Rect, show,
} from 'src/ts/utils';
import { ControlTip } from './helper';

export class VolumeControlItem extends Component {
  private readonly volumeIcon: HTMLElement;

  private readonly mutedIcon: HTMLElement;

  private readonly tip: ControlTip;

  private readonly bar: HTMLElement;

  private readonly rect: Rect;

  constructor(container: HTMLElement, private player: Player, barWidth = 100) {
    super(container, '.control_volume');
    this.tip = new ControlTip(this.element);
    this.volumeIcon = this.element.appendChild(icons.volume());
    this.mutedIcon = this.element.appendChild(icons.muted());

    const bars = this.element.appendChild($('.control_volume_bars'));
    bars.style.width = `${barWidth}px`;

    this.bar = bars.appendChild($('.control_volume_bar'));

    this.rect = new Rect(this.bar);

    this.onVolumeChange();

    addDisposable(this, player.on(EVENT.VOLUME_CHANGE, this.onVolumeChange));
    addDisposable(this, new Drag(bars, this.onDragStart, this.onDragging));
    addDisposableListener(this, this.element, 'click', (ev:MouseEvent) => {
      if (getEventPath(ev).includes(bars)) return;
      player.toggleVolume();
    });
  }

  private onDragStart = (ev: PointerEvent) => {
    this.onDragging(ev);
  }

  private onDragging = (ev: PointerEvent) => {
    const x = ev.pageX - this.rect.x;
    const v = clamp(x / this.rect.width);
    this.player.volume = v;
  }

  private onVolumeChange = () => {
    if (this.player.muted) {
      this.mute();
    } else {
      this.unmute();
    }
    this.bar.style.transform = `scaleX(${this.player.volume})`;
  };

  mute(): void {
    show(this.mutedIcon);
    hide(this.volumeIcon);
    this.tip.html = '取消静音';
  }

  unmute(): void {
    show(this.volumeIcon);
    hide(this.mutedIcon);
    this.tip.html = '静音';
  }
}
