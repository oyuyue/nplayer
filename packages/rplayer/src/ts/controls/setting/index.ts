import { SETTING_ACTIVE } from '../../config/classname';
import { SETTINGS } from '../../config/lang';
import Events from '../../events';
import icons from '../../icons';
import RPlayer from '../../rplayer';
import Tray from '../../widgets/tray';
import SettingMenu from './menu';
import EventHandler from '../../event-handler';

export default class Setting extends EventHandler {
  readonly menu: SettingMenu;
  private readonly tray: Tray;
  private resetPageTimer: NodeJS.Timeout;
  readonly pos = 3;

  constructor(player: RPlayer) {
    super(player, [
      Events.CLICK_CONTROL_MASK,
      Events.CLICK_OUTSIDE,
      Events.PLAYER_CONTEXT_MENU,
    ]);

    this.tray = new Tray({
      label: player.t(SETTINGS),
      icons: [icons.settings()],
      onClick: this.onClick,
    });

    this.menu = new SettingMenu(player);
    this.tray.dom.appendChild(this.menu.dom);
  }

  get dom(): HTMLElement {
    return this.tray.dom;
  }

  private hide(): void {
    this.dom.classList.remove(SETTING_ACTIVE);
    this.menu.hide();
    this.player.controls.mask.hide();
    clearTimeout(this.resetPageTimer);
    this.resetPageTimer = setTimeout(() => this.menu.resetPage(), 500);
  }

  private onClick = (): void => {
    this.dom.classList.add(SETTING_ACTIVE);
    this.menu.show();
    this.player.controls.mask.show();
  };

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
