import { SETTING_ACTIVE } from '../../config/classname';
import { SETTINGS } from '../../config/lang';
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
    super(player);

    this.tray = new Tray({
      label: player.t(SETTINGS),
      icons: [icons.settings()],
      onClick: this.onClick,
    });

    this.menu = new SettingMenu(player, this.onHide);
    this.tray.dom.appendChild(this.menu.dom);
  }

  get dom(): HTMLElement {
    return this.tray.dom;
  }

  private onHide = (): void => {
    this.dom.classList.remove(SETTING_ACTIVE);
    clearTimeout(this.resetPageTimer);
    this.resetPageTimer = setTimeout(() => this.menu.resetPage(), 500);
  };

  private onClick = (): void => {
    this.dom.classList.add(SETTING_ACTIVE);
    this.menu.show();
  };
}
