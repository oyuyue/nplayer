import { EVENT } from 'src/ts/constants';
import { I18n, MUTE, UNMUTE } from 'src/ts/features/i18n';
import { Icon } from 'src/ts/features/icons';
import { Player } from 'src/ts/player';
import {
  $, addDisposable, addDisposableListener, clamp, Component, Drag, getEventPath, hide, Rect, show,
} from 'src/ts/utils';
import { Tooltip } from 'src/ts/components/tooltip';

export class VolumeControlItem extends Component {
  static readonly id = 'volume';

  private readonly volumeIcon: HTMLElement;

  private readonly mutedIcon: HTMLElement;

  readonly tip: Tooltip;

  private readonly bar: HTMLElement;

  private readonly rect: Rect;

  constructor(container: HTMLElement, private player: Player, barWidth = 100) {
    super(container, '.control_volume');
    this.tip = new Tooltip(this.element);
    this.volumeIcon = this.element.appendChild(Icon.volume());
    this.mutedIcon = this.element.appendChild(Icon.muted());

    const bars = this.element.appendChild($('.control_volume_bars'));
    bars.style.width = `${barWidth}px`;

    this.bar = bars.appendChild($('.control_volume_bar'));
    this.bar.style.background = player.opts.volumeProgressBarColor;

    this.rect = new Rect(bars, player);

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
    this.tip.html = I18n.t(UNMUTE);
  }

  unmute(): void {
    show(this.volumeIcon);
    hide(this.mutedIcon);
    this.tip.html = I18n.t(MUTE);
  }
}
