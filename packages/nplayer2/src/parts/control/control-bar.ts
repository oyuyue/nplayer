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
      let i = 0;
      items.forEach((item) => {
        item = this.initItem(item, i) as ControlItem;
        if (item && item.el) {
          frag.appendChild(item.el);
          this.prevItems.push(item);
          i++;
        }
      });
      this.updateTooltipPos();
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
        mount: this.initOrUpdateItem as any,
        unmount: this.onUnmount as any,
        update: this.onUpdate as any,
      });
      this.prevItems = items;
      this.updateTooltipPos();
    }
  }

  removeItem(item: ControlItem) {
    this.prevItems = this.prevItems.filter((x) => x !== item);
  }

  private updateTooltipPos() {
    const lastIndex = this.prevItems.length - 1;
    this.prevItems.forEach((item, i) => {
      if (item.tooltip) {
        if (this.pos === 2) item.tooltip.bottom();
        if (i === 0) {
          item.tooltip.left();
        } else if (i === lastIndex) {
          item.tooltip.right();
        }
      }
    });
  }

  private getItem(item: ControlItem | string): ControlItem | void {
    if (isString(item)) item = this.player.getControlItem(item) as ControlItem;
    if (!item || (item.isSupported && !item.isSupported(this.player))) return;
    if (item.create) return item.create(this.player);
    return item;
  }

  private initItem(item: ControlItem | string, posY: number) {
    item = this.getItem(item) as ControlItem;
    if (!item) return;
    return this.initOrUpdateItem(item, posY);
  }

  private initOrUpdateItem = (item: ControlItem, posY: number) => {
    if (item.created__) {
      if (item.pos__ !== this.pos) {
        if (item.onHide) {
          item.onHide(item.pos__ as number);
        }
      }
      this.player.control.removeControlItem(item);

      item.pos__ = this.pos;

      if (item.tooltip) {
        item.tooltip.reset();
        if (this.pos === 2) item.tooltip.bottom();
      }
      if (item.onShow) item.onShow(this.pos, posY);
      return;
    }

    if (!item.el) item.el = $();
    let tooltip: Tooltip | undefined;
    if (item.tipText) tooltip = new Tooltip(item.el, item.tipText);
    item.tooltip = tooltip;
    if (item.onInit) item.onInit(this.player, this.pos, posY, tooltip);
    if (item.destroy) addDestroyable(this, item as Destroyable);
    if (tooltip) {
      tooltip.reset();
      if (this.pos === 2) tooltip.bottom();
    }

    item.pos__ = this.pos;
    item.created__ = true;
    return item;
  }

  private onUpdate = (item: ControlItem, pos: number) => {
    if (item.onShow) {
      item.onShow(this.pos, pos);
    }
  }

  private onUnmount = (item: ControlItem) => {
    if (item.onHide) {
      item.onHide(this.pos);
    }
  }
}
