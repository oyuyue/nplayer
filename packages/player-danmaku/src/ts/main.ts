import type { Plugin, Player } from 'player';
import { Danmaku } from './danmaku';
import { DanmakuSendBoxControlItem } from './send-box';
import { DanmakuSettingControlItem } from './setting';

export class DanmakuPlugin implements Plugin {
  apply(player: Player) {
    player.registerControlItem(DanmakuSendBoxControlItem);
    player.registerControlItem(DanmakuSettingControlItem);

    player.danmaku = new Danmaku(player);

    player.opts.controls.splice(3, 1, 'danmaku', 'danmaku-setting');
  }
}
