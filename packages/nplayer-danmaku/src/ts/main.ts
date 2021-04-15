import type { Plugin as P, Player } from 'nplayer';
import { Danmaku, DanmakuOptions } from './danmaku';
import { danmakuSendBoxControlItem } from './send-box';
import { danmakuSettingControlItem } from './setting';
import { trans } from './utils';

export class Plugin implements P {
  private opts: DanmakuOptions;

  constructor(opts: DanmakuOptions) {
    this.opts = opts;
  }

  apply(player: Player) {
    player.registerControlItem(danmakuSendBoxControlItem);
    player.registerControlItem(danmakuSettingControlItem);

    player.Player.I18n.add('zh-CN', trans);
    player.danmaku = new Danmaku(player, this.opts);

    const i = player.opts.controls.findIndex((c) => c === 'spacer');
    if (i > -1) {
      player.opts.controls.splice(i, 1, 'danmaku', 'danmaku-setting');
    }
  }
}
