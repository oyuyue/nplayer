import Component from '../component';
import {
  CTRL_MENU,
  CTRL_MENU_ITEM,
  CTRL_MENU_ITEM_CHECKED,
  CTRL_MENU_ITEM_I,
} from '../config/classname';
import Events from '../events';
import RPlayer from '../rplayer';
import {
  getClientWH,
  htmlDom,
  isElement,
  isFn,
  newElement,
  clampNeg,
} from '../utils';

export interface ContextMenuItem {
  icon?: string | Element;
  label?: string | Element;
  checked?: boolean;
  onClick?: (checked: boolean, update: () => void, ev: MouseEvent) => any;
}

export interface ContextMenuOpts {
  toggle?: boolean;
  enable?: boolean;
  items?: ContextMenuItem[];
}

export class MenuItem {
  readonly dom: HTMLElement;
  private checked = false;
  private readonly cb: ContextMenuItem['onClick'];

  constructor(item: ContextMenuItem) {
    this.dom = newElement(CTRL_MENU_ITEM);
    const i = isElement(item.icon) ? item.icon : htmlDom(item.icon);
    i.classList.add(CTRL_MENU_ITEM_I);
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
  }

  private next = (): void => {
    this.checked = !this.checked;
    this.update();
  };

  update(): void {
    if (this.checked) {
      this.dom.classList.add(CTRL_MENU_ITEM_CHECKED);
    } else {
      this.dom.classList.remove(CTRL_MENU_ITEM_CHECKED);
    }
  }

  clickHandler = (ev: MouseEvent): void => {
    ev.preventDefault();
    this.cb(!this.checked, this.next, ev);
  };
}

export default class ContextMenu extends Component {
  private showed = false;
  private enable: boolean;
  private toggle: boolean;

  constructor(player: RPlayer) {
    super(player, {
      events: [
        Events.PLAYER_CONTEXT_MENU,
        Events.CLICK_OUTSIDE,
        Events.CLICK_CONTROL_MASK,
      ],
      className: CTRL_MENU,
    });

    const opts = this.player.options.contextMenu;
    this.enable = opts.enable;
    this.toggle = opts.toggle;

    this.hidden();
    this.showed = !this.enable;
    opts.items.forEach((item) => {
      this.appendChild(new MenuItem(item).dom);
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

  addItem(opts: ContextMenuItem, pos?: number): MenuItem {
    const item = new MenuItem(opts);
    this.dom.insertBefore(
      item.dom,
      this.dom.children[clampNeg(pos, this.dom.children.length)]
    );
    return item;
  }

  onPlayerContextMenu(ev: MouseEvent): void {
    if (!this.showed || !this.toggle) {
      ev.preventDefault();
      ev.stopPropagation();
    }
    if (!this.enable) return;

    if (this.showed && this.toggle) {
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
