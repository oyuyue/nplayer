import { PlayerBase } from '../../player-base';
import { ControlItem } from '../../types';
import { Component, formatTime } from '../../utils';

export class CurrentTime extends Component implements ControlItem {
  id = 'current-time';

  onInit(player: PlayerBase) {

  }
}
