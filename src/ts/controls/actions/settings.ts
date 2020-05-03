import icons from '../../icons';
import SettingMenu from '../setting-menu';
import Tray from '../tray';

class SettingAction extends Tray {
  menu: SettingMenu;
  mask = document.createElement('div');
  resetPageTimer: NodeJS.Timeout;

  activeClass = 'rplayer_action_setting-active';

  constructor() {
    super();
    this.changeTipText('设置');
    this.appendChild(icons.settings);

    this.addClass('rplayer_action_setting');

    this.menu = new SettingMenu();
    this.appendChild(this.menu);

    this.addMask();
  }

  private addMask(): void {
    this.mask.classList.add('rplayer_action_setting_mask');
    this.mask.addEventListener('click', this.onMaskClick, true);
    this.appendChild(this.mask);
  }

  private onMaskClick = (ev: MouseEvent): void => {
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
