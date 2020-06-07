import RPlayer from 'rplayer';
import Events from './events';
import { AdsOpts, processOpts } from './options';
import Liner from './liner';
import NonLiner from './non-liner';

export default class Ads extends RPlayer.EventEmitter {
  static readonly Events = Events;

  private readonly dom: HTMLElement;
  readonly liner: Liner;
  readonly nonLiner: NonLiner;
  readonly opts: AdsOpts;

  constructor(opts: AdsOpts) {
    super();
    this.opts = processOpts(opts);
    this.dom = RPlayer.utils.newElement('rplayer_ad');
    this.liner = new Liner(this);
    this.nonLiner = new NonLiner(this);
  }

  install(player: RPlayer): void {
    player.addLang('zh-CN', { AD: '广告' });

    this.liner.install(player);
    this.nonLiner.install(player);

    this.dom.appendChild(this.liner.dom);
    this.dom.appendChild(this.nonLiner.dom);
    player.appendChild(this.dom);
  }
}
