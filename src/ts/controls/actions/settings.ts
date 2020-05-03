import icons from '../../icons';
import SettingMenu from '../setting-menu';
import Tray from '../tray';

class SettingAction extends Tray {
  menu: SettingMenu;
  mask = document.createElement('div');
  resetPageTimer: NodeJS.Timeout;

  constructor() {
    super();
    this.changeTipText('设置');
    this.appendChild(icons.settings);

    this.addClass('rplayer_actions_setting');
    this.setRight();

    this.menu = new SettingMenu();
    this.appendChild(this.menu);

    this.addMask();
  }

  addMask(): void {
    this.mask.classList.add('rplayer_actions_setting_mask');
    this.mask.addEventListener('click', this.onMaskClick, true);
    this.appendChild(this.mask);
  }

  onMaskClick = (ev: MouseEvent): void => {
    ev.preventDefault();
    ev.stopPropagation();

    this.removeClass('rplayer_actions_setting-active');
    clearTimeout(this.resetPageTimer);
    this.resetPageTimer = setTimeout(() => {
      this.menu.resetPage();
    }, 500);
  };

  onClick(): void {
    this.addClass('rplayer_actions_setting-active');
  }
}

export default SettingAction;
