import Component from '../component';
import Events from '../events';
import { ContextMenuItem, ContextMenuOpts } from '../options';
import RPlayer from '../rplayer';
import { getClientWH, htmlDom, isElement, isFn, newElement } from '../utils';

class MenuItem {
  readonly dom: HTMLElement;
  private checked = false;
  private readonly cb: ContextMenuItem['onClick'];
  private readonly checkedClass = 'rplayer_ctrl_menu_item-checked';

  constructor(item: ContextMenuItem, menu: ContextMenu) {
    this.dom = newElement('div', 'rplayer_ctrl_menu_item');
    const i = isElement(item.icon) ? item.icon : htmlDom(item.icon);
    i.classList.add('rplayer_ctrl_menu_item_i');
    this.dom.appendChild(i);
    this.dom.appendChild(
      isElement(item.label) ? item.label : htmlDom(item.label)
    );

    this.checked = !!item.checked;
    this.update();

    if (isFn(item.onClick)) {
      this.cb = item.onClick;
      this.dom.addEventListener('click', this.clickHandler, true);
    }

    menu.appendChild(this.dom);
  }

  private next = (): void => {
    this.checked = !this.checked;
    this.update();
  };

  update(): void {
    if (this.checked) {
      this.dom.classList.add(this.checkedClass);
    } else {
      this.dom.classList.remove(this.checkedClass);
    }
  }

  clickHandler = (ev: MouseEvent): void => {
    ev.preventDefault();
    this.cb(!this.checked, this.next, ev);
  };
}

class ContextMenu extends Component {
  private showed = false;
  private opts: ContextMenuOpts;

  constructor(player: RPlayer) {
    super(player, {
      events: [
        Events.PLAYER_CONTEXT_MENU,
        Events.CLICK_OUTSIDE,
        Events.CLICK_CONTROL_MASK,
      ],
    });

    this.opts = this.player.options.contextMenu;
    this.addClass('rplayer_ctrl_menu');
    this.hidden();

    this.showed = !this.opts.enable;

    this.opts.items.forEach((item) => {
      new MenuItem(item, this);
    });

    this.dom.addEventListener('click', this.clickHandler);
  }

  hide(): void {
    this.player.controls.mask.hide();
    this.hidden();
  }

  show(): void {
    this.player.controls.mask.show();
    this.visible();
  }

  clickHandler = (ev: MouseEvent): void => {
    ev.preventDefault();
    ev.stopPropagation();
    this.showed = false;
    this.hide();
  };

  onPlayerContextMenu(ev: MouseEvent): void {
    if (!this.showed || !this.opts.toggle) {
      ev.preventDefault();
      ev.stopPropagation();
    }
    if (!this.opts.enable) return;

    if (this.showed && this.opts.toggle) {
      this.showed = false;
      this.hide();
    } else {
      this.show();
      const { width, height } = this.rect;
      const { left, top } = this.player.rect;
      const [w, h] = getClientWH();

      let l = ev.pageX - left;
      let t = ev.pageY - top;
      if (ev.pageX + width > w) l = w - width;
      if (ev.pageY + height > h) t = h - height;

      this.addStyle({
        left: l + 'px',
        top: t + 'px',
      });
      this.showed = true;
    }
  }

  onClickOutside(): void {
    this.hide();
    this.showed = false;
  }

  onClickControlMask(): void {
    this.hide();
  }
}

export default ContextMenu;
