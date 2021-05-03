import { Player } from 'src/ts/player';
import {
  $, addClass, addDisposable, Component, isString, patch,
} from 'src/ts/utils';
import { Tooltip } from 'src/ts/components/tooltip';
import { Disposable } from 'src/ts/types';
import { ControlItem } from '..';
import { spacerControlItem } from './spacer';

export class ControlBar extends Component {
  private prevItems: ControlItem[] = [];

  private spacer = spacerControlItem();

  constructor(container: HTMLElement, private player: Player, items?: (ControlItem | string)[], private isTop = false) {
    super(container, '.control_bar');
    if (isTop) addClass(this.element, 'control_bar-top');
    if (items) {
      const frag = document.createDocumentFragment();
      items.forEach((item) => {
        item = this.initControlItem(item) as ControlItem;
        if (item) {
          frag.appendChild(item.element);
          this.prevItems.push(item);
        }
      });
      this.setTooltipPos();
      this.element.appendChild(frag);
    }
  }

  private setTooltipPos() {
    const first = this.prevItems[0];
    const last = this.prevItems[this.prevItems.length - 1];
    if (last && last.tooltip) {
      last.tooltip.setRight();
    }
    if (first !== last && first.tooltip) {
      first.tooltip.setLeft();
    }
  }

  private getItem(item: ControlItem | string): ControlItem | void {
    if (item === 'spacer') return this.spacer;
    if (isString(item)) item = this.player.getControlItem(item) as ControlItem;
    if (!item || (item.isSupport && !item.isSupport(this.player))) return;
    return item;
  }

  private initControlItem = (item: ControlItem | string): ControlItem | void => {
    item = this.getItem(item) as ControlItem;
    if (item) {
      if (!item.element) item.element = $();
      if (item.mounted) {
        if (item.tooltip) {
          item.tooltip.resetPos();
          if (this.isTop) item.tooltip.setBottom();
        }
        if (item.update) item.update(this.isTop);
        return;
      }

      let tooltip: Tooltip | undefined;
      if (item.tip) tooltip = new Tooltip(item.element, item.tip);
      if (item.init) {
        if (item.init.length > 2 && !tooltip) tooltip = new Tooltip(item.element);
        item.init(this.player, this.isTop, tooltip as Tooltip);
      }
      if (item.dispose) addDisposable(this, item as Disposable);
      if (!tooltip) tooltip = item.tooltip;
      if (tooltip) {
        tooltip.resetPos();
        if (this.isTop) tooltip.setBottom();
      }

      item.mounted = true;
      return item;
    }
  }

  update(nextItems: (string | ControlItem)[]) {
    if (nextItems) {
      const items: ControlItem[] = [];
      nextItems.forEach((item) => {
        item = this.getItem(item) as ControlItem;
        if (item) items.push(item);
      });

      patch(this.prevItems, items, this.element, this.initControlItem);
      this.prevItems = items;
      this.setTooltipPos();
    }
  }
}
