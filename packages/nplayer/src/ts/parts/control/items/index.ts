import { Player } from 'src/ts/player';
import {
  addDisposable, Component, isFunction, isString,
} from 'src/ts/utils';
import { Tooltip } from 'src/ts/components/tooltip';
import { Disposable } from 'src/ts/types';
import { ControlItem, ControlItemEntry } from '..';

export class ControlBar extends Component {
  constructor(container: HTMLElement, player: Player) {
    super(container, '.control_bar');
    const last = player.opts.controls.length - 1;
    player.opts.controls.forEach((Item, i) => {
      if (isString(Item)) Item = player.getControlItem(Item) as ControlItemEntry;
      if (Item) {
        let item: ControlItem;
        if (isFunction(Item)) {
          item = Item(player);
        } else {
          item = Item;
        }
        if (item.isSupport && !item.isSupport(player)) return;
        let tooltip: Tooltip | undefined;
        if (item.tip) tooltip = new Tooltip(item.element, item.tip);
        if (item.init) {
          if (item.init.length > 1 && !tooltip) tooltip = new Tooltip(item.element);
          item.init(player, tooltip as Tooltip);
        }
        if (item.dispose) addDisposable(this, item as Disposable);
        if (!tooltip) tooltip = item.tooltip;
        if (tooltip) {
          if (i === 0) {
            tooltip.setLeft();
          } else if (i === last) {
            tooltip.setRight();
          }
        }
        if (Item.id) player.registerControlItem(item, Item.id);

        this.element.appendChild(item.element);
      }
    });
  }
}
