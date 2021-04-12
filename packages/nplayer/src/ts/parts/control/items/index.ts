import { Player } from 'src/ts/player';
import { Component, isFunction, isString } from 'src/ts/utils';
import { Tooltip } from 'src/ts/components/tooltip';
import { ObjControlItem } from 'src';

function isObjItem(o: any): o is ObjControlItem {
  return !isFunction(o) && isFunction(o.init);
}

export class ControlBar extends Component {
  constructor(container: HTMLElement, player: Player) {
    super(container, '.control_bar');

    const last = player.opts.controls.length - 1;
    player.opts.controls.forEach((Item, i) => {
      if (isString(Item)) Item = player.controlNamedMap[Item];
      if (Item) {
        let item: any = Item;
        if (Item.isSupport && !Item.isSupport()) return;
        if (isObjItem(Item)) {
          Item.init(this.element, player);
        } else {
          item = new Item(this.element, player);
        }

        if (item.tip && item.tip instanceof Tooltip) {
          if (i === 0) {
            item.tip.setLeft();
          } else if (i === last) {
            item.tip.setRight();
          }
        }
      }
    });
  }
}
