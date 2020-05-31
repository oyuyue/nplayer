import RPlayer from 'rplayer';
import { AdsOpts, processOpts } from './options';
import Liner from './liner';

export default class Ads {
  private player: RPlayer;
  private readonly dom: HTMLElement;
  private readonly liner: Liner;
  private readonly opts: AdsOpts;

  constructor(opts: AdsOpts) {
    this.opts = processOpts(opts);
    this.liner = new Liner(this.opts);
    this.dom = RPlayer.utils.newElement('rplayer_ad');
    this.dom.appendChild(this.liner.dom);
  }

  install(player: RPlayer): void {
    this.player = player;
    this.liner.install(player);

    player.appendChild(this.dom);
  }
}
