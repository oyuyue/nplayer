import type { Plugin as P, Player } from 'nplayer';
import { Danmaku, DanmakuOptions } from './danmaku';
import { danmakuSendBoxControlItem } from './send-box';
import { danmakuSettingControlItem } from './setting';
import { trans } from './utils';

export interface DanmakuPluginOption extends DanmakuOptions {
  autoInsertControl: boolean;
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

    if (this.opts && this.opts.autoInsertControl !== false) {
      const i = player.opts.controls.findIndex((c) => c === 'spacer');
      if (i > -1) {
        player.opts.controls.splice(i + 1, 0, 'danmaku', 'danmaku-setting');
        player.once(player.EVENT.AFTER_INIT, () => {
          const spacer = player.getControlItem('spacer');
          if (spacer && (spacer as any).flex) {
            (spacer as any).flex(0);
          }
        });
      } else {
        player.opts.controls.push('danmaku', 'danmaku-setting');
      }
    }
  }
}
