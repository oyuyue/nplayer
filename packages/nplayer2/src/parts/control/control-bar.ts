import type { ControlItem, Destroyable } from '../../types';
import type { PlayerBase } from '../../player-base';
import {
  addClass, Component, isString, $, addDestroyable, patch,
} from '../../utils';
import { Tooltip } from '../../components';

export class ControlBar extends Component {
  private prevItems: ControlItem[] = [];

  constructor(
    container: HTMLElement,
    private player: PlayerBase,
    private pos: number,
    items?: (ControlItem | string)[],
  ) {
    super(container, '.ctrl_bar');
    if (pos === 2) addClass(this.el, 'ctrl_bar-top');
    if (items) {
      const frag = document.createDocumentFragment();
      items.forEach((item) => {
        item = this.initItem(item) as ControlItem;
        if (item && item.el) {
          frag.appendChild(item.el);
          this.prevItems.push(item);
        }
      });
      // this.updateTooltipPos();
      this.el.appendChild(frag);
    }
  }

  update(nextItems: (string | ControlItem)[]) {
    if (nextItems) {
      const items: ControlItem[] = [];
      nextItems.forEach((item) => {
        item = this.getItem(item) as ControlItem;
        if (item) items.push(item);
      });

      patch(this.prevItems, items, this.el, {
        mount: this.initItem as any,
        unmount: () => {},
      });
      this.prevItems = items;
      // this.updateTooltipPos();
      // this.player.emit(EVENT.CONTROL_ITEM_UPDATE);
    }
  }

  getItems(): ControlItem[] {
    return this.prevItems;
  }

  setItems(items?: ControlItem[]): void {
    if (items) {
      this.prevItems = items;
    }
  }

  private getItem(item: ControlItem | string): ControlItem | void {
    if (isString(item)) item = this.player.getControlItem(item) as ControlItem;
    if (!item || (item.isSupported && !item.isSupported(this.player))) return;
    if (item.create) return item.create(this.player);
    return item;
  }

  private initItem = (item: ControlItem | string): ControlItem | void => {
    item = this.getItem(item) as ControlItem;
    if (!item) return;
    if (item._created) {
      if (item.tooltip) {
        item.tooltip.reset();
        if (this.pos === 2) item.tooltip.bottom();
      }
      if (item.onUpdate) item.onUpdate(this.pos);
      return;
    }

    if (!item.el) item.el = $();
    let tooltip: Tooltip | undefined;
    if (item.tip) tooltip = new Tooltip(item.el, item.tip);
    item.tooltip = tooltip;
    if (item.onInit) {
      item.onInit(this.player, this.pos, tooltip);
    }
    if (item.destroy) addDestroyable(this, item as Destroyable);
    if (tooltip) {
      tooltip.reset();
      if (this.pos === 2) tooltip.bottom();
    }

    item._created = true;
    return item;
  }
}
