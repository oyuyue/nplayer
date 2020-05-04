import icons from '../../icons';
import RPlayer from '../../rplayer';
import { newElement } from '../../utils';
import SettingMenu from '../setting-menu';
import Tray from '../tray';

class SettingAction extends Tray {
  private readonly menu: SettingMenu;
  private readonly mask = newElement();

  private resetPageTimer: NodeJS.Timeout;

  private readonly activeClass = 'rplayer_action_setting-active';

  constructor(player: RPlayer) {
    super(player);

    this.addClass('rplayer_action_setting');
    this.changeTipText('设置');

    this.menu = new SettingMenu();
    this.mask.classList.add('rplayer_action_setting_mask');
    this.mask.addEventListener('click', this.maskClickHandler);

    this.appendChild(icons.settings);
    this.appendChild(this.menu);
    this.appendChild(this.mask);
  }

  private maskClickHandler = (ev: MouseEvent): void => {
    ev.preventDefault();
    ev.stopPropagation();

    this.removeClass(this.activeClass);

    clearTimeout(this.resetPageTimer);
    this.resetPageTimer = setTimeout(() => {
      this.menu.resetPage();
    }, 500);
  };

  onClick(): void {
    this.addClass(this.activeClass);
  }
}

export default SettingAction;
