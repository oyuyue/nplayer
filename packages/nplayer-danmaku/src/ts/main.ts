import type { Plugin as P, Player } from 'nplayer';
import { Danmaku, DanmakuOptions } from './danmaku';
import { danmakuSendBoxControlItem } from './send-box';
import { danmakuSettingControlItem } from './setting';
import { trans } from './utils';

export interface DanmakuPluginOption extends DanmakuOptions {
  autoInsert: boolean;
}

export class Plugin implements P {
  private opts: DanmakuPluginOption;

  constructor(opts: DanmakuPluginOption) {
    this.opts = opts;
  }

  apply(player: Player) {
    player.registerControlItem(danmakuSendBoxControlItem());
    player.registerControlItem(danmakuSettingControlItem());

    player.Player.I18n.add('zh-cn', trans);
    player.danmaku = new Danmaku(player, this.opts);

    if (!player.mounted && this.opts && this.opts.autoInsert !== false) {
      const i = player.opts.controls[0].findIndex((c) => c === 'spacer');
      if (i !== -1) {
        player.opts.controls[0].splice(i, 1, 'danmaku-send', 'danmaku-settings');
      }
    }
  }

  static Plugin = Plugin;
}
