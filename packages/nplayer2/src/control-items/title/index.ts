import type { PlayerBase } from '../../player-base';
import type { ControlItem } from '../../types';
import { Component } from '../../utils';

export class Title extends Component implements ControlItem {
  id = 'title'

  onInit(player: PlayerBase) {
    this.el.textContent = player.current.title || '';
  }
}
