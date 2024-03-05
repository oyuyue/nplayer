import { EVENT } from '../constants';
import type { PlayerBase } from '../player-base';
import { Destroyable } from '../types';

export class Disable implements Destroyable {
  private prevCurrentTime = 0;

  constructor(private player: PlayerBase) {
    this.player = player;
  }

  enableSeek() {
    this.player.config.disableSeek = true;
    this.player.on(EVENT.SEEKING, this.onSeeking);
    this.player.on(EVENT.TIMEUPDATE, this.onTimeupdate);
  }

  disableSeek() {
    this.player.config.disableSeek = false;
    this.player.off(EVENT.SEEKING, this.onSeeking);
    this.player.off(EVENT.TIMEUPDATE, this.onTimeupdate);
  }

  enablePlay() {
    this.player.config.disablePlay = true;
    this.player.on(EVENT.PLAY, this.onPlay);
    this.player.pause();
  }

  disablePlay() {
    this.player.config.disablePlay = false;
    this.player.off(EVENT.PLAY, this.onPlay);
  }

  destroy() {
    this.enableSeek();
    this.enablePlay();
  }

  private onSeeking = () => {
    if (this.player.currentTime !== this.prevCurrentTime) {
      this.player.currentTime = this.prevCurrentTime;
    }
  }

  private onTimeupdate = () => {
    this.prevCurrentTime = this.player.currentTime;
  }

  private onPlay = () => {
    this.player.pause();
  }
}
