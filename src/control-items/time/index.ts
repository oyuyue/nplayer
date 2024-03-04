import { EVENT, I18nKey } from '../../constants';
import { I18n } from '../../features';
import type { PlayerBase } from '../../player-base';
import type { ControlItem, Destroyable } from '../../types';
import {
  $, addClass, addDestroyable, addDestroyableListener,
  callAndRemoveDestroyable, Component, containClass, formatTime, hide,
  removeClass, show,
} from '../../utils';
import './index.scss';

const DARK = 'ctrl_time_live-dark';

export class Time extends Component implements ControlItem {
  id = 'time';

  private player!: PlayerBase;

  private liveEl!: HTMLElement;

  private playEl!: HTMLElement;

  private sepEl!: HTMLElement;

  private totalEl!: HTMLElement;

  private destroyableArr?: Destroyable[];

  onInit(player: PlayerBase) {
    this.player = player;
    addClass(this.el, 'ctrl_time');

    this.liveEl = this.el.appendChild($('.ctrl_time_live'));
    this.playEl = this.el.appendChild($('span'));
    this.sepEl = this.el.appendChild($('span.ctrl_time_sep', undefined, '/'));
    this.totalEl = this.el.appendChild($('span'));

    this.setLightTo(true);

    if (player.config.live) {
      this.toLive();
    } else {
      this.toVod();
    }

    addDestroyableListener(this, this.liveEl, 'click', () => {
      if (this.isLight) return;
      player.emit(EVENT.CLICK_LIVE);
      this.setLightTo(true);
    });

    addDestroyable(this, player.on(EVENT.TO_LIVE, this.toLive));
    addDestroyable(this, player.on(EVENT.TO_VOD, this.toVod));
  }

  get isLight() {
    return !containClass(this.liveEl, DARK);
  }

  setLightTo(v: boolean) {
    if (v) {
      removeClass(this.liveEl, DARK);
      this.liveEl.textContent = I18n.t(I18nKey.LIVE);
    } else {
      addClass(this.liveEl, DARK);
      this.liveEl.textContent = I18n.t(I18nKey.BACK_TO_LIVE);
    }
  }

  private setPlay(v: number) {
    this.playEl.textContent = formatTime(v);
  }

  private setTotal(v: number) {
    this.totalEl.textContent = formatTime(v);
  }

  private toLive = () => {
    show(this.liveEl);
    hide(this.playEl);
    hide(this.sepEl);
    hide(this.totalEl);

    this.destroyableArr?.forEach((x) => {
      callAndRemoveDestroyable(this, x);
    });
  }

  private toVod = () => {
    hide(this.liveEl);
    show(this.playEl);
    show(this.sepEl);
    show(this.totalEl);

    const player = this.player;

    this.setPlay(player.currentTime);
    this.setTotal(player.duration);

    this.destroyableArr = [
      addDestroyable(this, player.on(EVENT.TIMEUPDATE, () => this.setPlay(player.currentTime))),
      addDestroyable(this, player.on(EVENT.DURATIONCHANGE, () => this.setTotal(player.duration))),
    ];
  }
}
