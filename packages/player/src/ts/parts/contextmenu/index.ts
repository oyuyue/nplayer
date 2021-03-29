import { Player } from 'src/ts/player';
import {
  $, addClass, show, hide, addDisposableListener, Rect, Component,
} from 'src/ts/utils';

export interface ContextMenuItem {
  id?: string;
  html?: string;
  disabled?: boolean;
  invisible?: boolean;
  checked?: boolean;
  init?: (item: ContextMenuItem, player: Player) => void;
  click?: (item: ContextMenuItem, player: Player) => void;
}

export class ContextMenu extends Component {
  private rect: Rect;

  private showed = false;

  constructor(
    container: HTMLElement,
    private player: Player,
    private items: ContextMenuItem[],
  ) {
    super(container, '.contextmenu');
    hide(this.element);

    this.rect = new Rect(this.element, player);

    this.items.forEach((item) => item.init && item.init(item, player));

    addDisposableListener(this, player.element, 'contextmenu', (ev: MouseEvent) => {
      this.hide();
      if (!player.opts.contextMenuToggle || !this.showed) {
        ev.preventDefault();
        ev.stopPropagation();
        if (this.renderItems()) {
          show(this.element);
          this.rect.update();

          const { width, height } = this.rect;
          const { x, y } = this.player.rect;
          const { innerWidth, innerHeight } = window;
          const { pageX, pageY } = ev;

          let left = pageX - x;
          let top = pageY - y;

          if (pageX + width > innerWidth) left = innerWidth - width;
          if (pageY + height > innerHeight) top = innerHeight - height;

          this.applyStyle({ left: `${left}px`, top: `${top}px` });
        }
      }

      this.showed = !this.showed;
    });

    addDisposableListener(this, document, 'click', this.hide);
  }

  private getDomNodes(): HTMLElement[] {
    return this.items.filter((x) => x && !x.invisible).map((item) => {
      const el = $('.contextmenu_item');
      if (item.html) el.innerHTML = item.html;
      if (item.disabled) addClass(el, 'contextmenu_item-disabled');
      if (item.checked) addClass(el, 'contextmenu_item-checked');
      if (item.click) {
        el.addEventListener('click', () => (item as any).click(item, this.player), false);
      }
      return el;
    });
  }

  private renderItems(): boolean {
    const items = this.getDomNodes();
    if (!items.length) return false;
    this.element.textContent = '';
    const frag = document.createDocumentFragment();
    items.forEach((item) => frag.appendChild(item));
    this.element.appendChild(frag);
    return true;
  }

  hide = () => {
    hide(this.element);
  }
}
