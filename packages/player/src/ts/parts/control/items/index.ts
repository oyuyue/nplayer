import { Player } from 'src/ts/player';
import { Component, isString } from 'src/ts/utils';
import { Tooltip } from 'src/ts/components/tooltip';

export class ControlBar extends Component {
  constructor(container: HTMLElement, player: Player) {
    super(container, '.control_bar');

    const last = player.opts.controls.length - 1;
    player.opts.controls.forEach((Item, i) => {
      if (isString(Item)) Item = player.controlNamedMap[Item];
      if (Item) {
        const item = new Item(this.element, player);
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
