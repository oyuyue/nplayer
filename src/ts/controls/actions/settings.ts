import { SETTINGS } from '../../config/lang';
import Events from '../../events';
import icons from '../../icons';
import RPlayer from '../../rplayer';
import SettingMenu from '../setting-menu';
import Tray from '../tray';

class SettingAction extends Tray {
  readonly menu: SettingMenu;
  private resetPageTimer: NodeJS.Timeout;
  private readonly activeClass = 'rplayer_action_set-active';

  constructor(player: RPlayer) {
    super(
      player,
      Events.CLICK_CONTROL_MASK,
      Events.CLICK_OUTSIDE,
      Events.PLAYER_CONTEXT_MENU
    );

    this.addClass('rplayer_action_set');
    this.changeTipText(player.t(SETTINGS));

    this.menu = new SettingMenu(player);

    this.appendChild(icons.settings());
    this.appendChild(this.menu);
  }

  private hide(): void {
    this.removeClass(this.activeClass);
    this.player.controls.mask.hide();
    clearTimeout(this.resetPageTimer);
    this.resetPageTimer = setTimeout(() => {
      this.menu.resetPage();
    }, 500);
  }

  onClick(): void {
    this.addClass(this.activeClass);
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

export default SettingAction;
