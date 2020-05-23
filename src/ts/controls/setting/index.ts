import { TRAY_SETTING, TRAY_SETTING_ACTIVE } from '../../config/classname';
import { SETTINGS } from '../../config/lang';
import Events from '../../events';
import icons from '../../icons';
import RPlayer from '../../rplayer';
import Tray from '../trays/tray';
import SettingMenu from './menu';

export default class Setting extends Tray {
  readonly menu: SettingMenu;
  private resetPageTimer: NodeJS.Timeout;

  constructor(player: RPlayer) {
    super(
      player,
      player.t(SETTINGS),
      Events.CLICK_CONTROL_MASK,
      Events.CLICK_OUTSIDE,
      Events.PLAYER_CONTEXT_MENU
    );

    this.pos = 3;
    this.addClass(TRAY_SETTING);
    this.menu = new SettingMenu(player);
    this.appendChild(icons.settings());
    this.appendChild(this.menu);
  }

  private hide(): void {
    this.removeClass(TRAY_SETTING_ACTIVE);
    this.player.controls.mask.hide();
    clearTimeout(this.resetPageTimer);
    this.resetPageTimer = setTimeout(() => this.menu.resetPage(), 500);
  }

  onClick(): void {
    this.addClass(TRAY_SETTING_ACTIVE);
    this.player.controls.mask.show();
  }

  onPlayerContextMenu(): void {
    this.hide();
  }

  onClickControlMask(): void {
    this.hide();
  }

  onClickOutside(): void {
    this.hide();
  }
}
