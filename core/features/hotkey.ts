import type { PlayerBase } from '../player-base';

export class Hotkey {
  constructor(private player: PlayerBase) {
    this.player = player;
  }
}
