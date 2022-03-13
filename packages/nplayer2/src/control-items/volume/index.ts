import { Tooltip } from '../../components';
import { EVENT, I18nKey } from '../../constants';
import { I18n } from '../../features';
import { PlayerBase } from '../../player-base';
import { ControlItem } from '../../types';
import {
  Component, Icon, $, addDestroyable, show, hide, Drag, Rect, clamp, addDestroyableListener, isString,
} from '../../utils';
import './index.scss';

export class Volume extends Component implements ControlItem {
  id = 'volume';

  tip = '1';

  tooltip!: Tooltip;

  private player!: PlayerBase;

  private volumeIcon!: HTMLElement;

  private mutedIcon!: HTMLElement;

  private barEl!: HTMLElement;

  private rect!: Rect;

  private hor!: boolean;

  onInit(player: PlayerBase) {
    this.player = player;
    const { volumeHorizontal = false, volumeLength = 100 } = player.config.control;
    this.hor = volumeHorizontal;

    if (!volumeHorizontal) this.tooltip.hide();

    const btn = this.el.appendChild($('.ctrl_vol_btn'));
    this.volumeIcon = btn.appendChild(Icon.volume());
    this.mutedIcon = btn.appendChild(Icon.muted());

    const bars = this.el.appendChild($('.ctrl_vol_bars'));
    bars.style[volumeHorizontal ? 'height' : 'width'] = isString(volumeLength) ? volumeLength : `${volumeLength}px`;
    this.barEl = bars.appendChild($('.ctrl_vol_bar'));

    this.rect = new Rect(bars, player);

    addDestroyable(this, player.on(EVENT.VOLUMECHANGE, this.onVolumeChange));
    addDestroyable(this, new Drag(bars, this.onDragging, this.onDragging));
    addDestroyableListener(this, btn, 'click', () => {
      player.toggleVolume();
    });

    this.onVolumeChange();
  }

  mute(): void {
    show(this.mutedIcon);
    hide(this.volumeIcon);
    if (this.hor) this.tooltip.html = I18n.t(I18nKey.UNMUTE);
  }

  unmute(): void {
    show(this.volumeIcon);
    hide(this.mutedIcon);
    if (this.hor) this.tooltip.html = I18n.t(I18nKey.MUTE);
  }

  private onDragging = (ev: PointerEvent) => {
    this.rect.update();
    this.player.volume = clamp(
      (this.hor ? ev.clientX - this.rect.x : this.rect.height - ev.clientY + this.rect.y)
      / (this.hor ? this.rect.width : this.rect.height),
    );
  }

  private onVolumeChange = () => {
    if (this.player.muted) {
      this.mute();
    } else {
      this.unmute();
    }
    this.barEl.style.transform = `scale${this.hor ? 'X' : 'Y'}(${this.player.volume})`;
  };
}
