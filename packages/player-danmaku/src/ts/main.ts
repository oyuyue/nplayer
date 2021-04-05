import type { Plugin, Player } from 'player';
import { Danmaku, DanmakuOptions } from './danmaku';
import { DanmakuSendBoxControlItem } from './send-box';
import { DanmakuSettingControlItem } from './setting';

export class DanmakuPlugin implements Plugin {
  private opts: DanmakuOptions;

  constructor(opts: DanmakuOptions) {
    this.opts = opts;
  }

  apply(player: Player) {
    player.registerControlItem(DanmakuSendBoxControlItem);
    player.registerControlItem(DanmakuSettingControlItem);

    player.danmaku = new Danmaku(player, this.opts);

    player.opts.controls.splice(3, 1, 'danmaku', 'danmaku-setting');
  }
}
