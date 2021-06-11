import { EVENT } from 'src/ts/constants';
import { I18n, MUTE, UNMUTE } from 'src/ts/features/i18n';
import { Icon } from 'src/ts/features/icons';
import { Player } from 'src/ts/player';
import {
  $, addClass, addDisposable, addDisposableListener, clamp, Component, Drag, getEventPath, hide, isString, Rect, show,
} from 'src/ts/utils';
import { Tooltip } from 'src/ts/components/tooltip';
import { ControlItem } from '..';

class Volume extends Component implements ControlItem {
  readonly id = 'volume';

  private player!: Player;

  private volumeIcon!: HTMLElement;

  private mutedIcon!: HTMLElement;

  private bar!: HTMLElement;

  private rect!: Rect;

  private isVer!: boolean;

  tooltip!: Tooltip;

  init(player: Player, _: any, tooltip: Tooltip) {
    this.player = player;
    this.tooltip = tooltip;
    this.isVer = player.opts.volumeVertical;

    addClass(this.el, 'control_volume');
    addClass(this.el, `control_volume-${this.isVer ? 'ver' : 'hor'}`);

    if (this.isVer) tooltip.hide();

    this.volumeIcon = this.el.appendChild(Icon.volume());
    this.mutedIcon = this.el.appendChild(Icon.muted());

    const bars = this.el.appendChild($('.control_volume_bars'));
    const len = player.opts.volumeBarLength;
    bars.style[this.isVer ? 'height' : 'width'] = isString(len) ? len : `${len}px`;

    this.bar = bars.appendChild($('.control_volume_bar'));

    this.rect = new Rect(bars, player);

    addDisposable(this, player.on(EVENT.VOLUME_CHANGE, this.onVolumeChange));
    addDisposable(this, new Drag(bars, this.onDragStart, this.onDragging));
    addDisposableListener(this, this.el, 'click', (ev:MouseEvent) => {
      if (getEventPath(ev).includes(bars)) return;
      player.toggleVolume();
    });
    if (player.opts.isTouch) {
      addDisposableListener(this, bars, 'touchstart', (ev: Event) => ev.preventDefault());
    }

    this.onVolumeChange();
  }

  private onDragStart = (ev: PointerEvent) => {
    this.onDragging(ev);
  }

  private onDragging = (ev: PointerEvent) => {
    this.rect.update();
    this.player.volume = clamp(
      (this.isVer ? this.rect.height - ev.clientY + this.rect.y : ev.clientX - this.rect.x)
      / (this.isVer ? this.rect.height : this.rect.width),
    );
  }

  private onVolumeChange = () => {
    if (this.player.muted) {
      this.mute();
    } else {
      this.unmute();
    }
    this.bar.style.transform = `scale${this.isVer ? 'Y' : 'X'}(${this.player.volume})`;
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

export const volumeControlItem = () => new Volume();
