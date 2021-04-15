import { EVENT } from 'src/ts/constants';
import { I18n, MUTE, UNMUTE } from 'src/ts/features/i18n';
import { Icon } from 'src/ts/features/icons';
import { Player } from 'src/ts/player';
import {
  $, addDisposable, addDisposableListener, clamp, Component, Drag, getEventPath, hide, isString, Rect, show,
} from 'src/ts/utils';
import { Tooltip } from 'src/ts/components/tooltip';
import { ControlItem } from '..';

class Volume extends Component implements ControlItem {
  private readonly volumeIcon: HTMLElement;

  private readonly mutedIcon: HTMLElement;

  private readonly bar: HTMLElement;

  private readonly rect: Rect;

  tooltip!: Tooltip;

  constructor(private player: Player) {
    super(undefined, '.control_volume');
    this.volumeIcon = this.element.appendChild(Icon.volume());
    this.mutedIcon = this.element.appendChild(Icon.muted());

    const bars = this.element.appendChild($('.control_volume_bars'));
    const barWidth = player.opts.volumeBarWidth;
    bars.style.width = isString(barWidth) ? barWidth : `${barWidth}px`;

    this.bar = bars.appendChild($('.control_volume_bar'));

    this.rect = new Rect(bars, player);

    addDisposable(this, player.on(EVENT.VOLUME_CHANGE, this.onVolumeChange));
    addDisposable(this, new Drag(bars, this.onDragStart, this.onDragging));
    addDisposableListener(this, this.element, 'click', (ev:MouseEvent) => {
      if (getEventPath(ev).includes(bars)) return;
      player.toggleVolume();
    });
  }

  init(_: any, tooltip: Tooltip) {
    this.tooltip = tooltip;
    this.onVolumeChange();
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
    this.tooltip.html = I18n.t(UNMUTE);
  }

  unmute(): void {
    show(this.volumeIcon);
    hide(this.mutedIcon);
    this.tooltip.html = I18n.t(MUTE);
  }
}

const volumeControlItem = (player: Player) => new Volume(player);
volumeControlItem.id = 'volume';
export { volumeControlItem };
