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
  init?: (player: Player, item: ContextMenuItem) => void;
  show?: (player: Player, item: ContextMenuItem) => void;
  click?: (player: Player, item: ContextMenuItem) => void;
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
    hide(this.el);

    this.rect = new Rect(this.el, player);

    this.items.forEach((item) => item.init && item.init(player, item));

    addDisposableListener(this, player.el, 'contextmenu', (ev: MouseEvent) => {
      this.hide();
      if (!player.opts.contextMenuToggle || !this.showed) {
        ev.preventDefault();
        ev.stopPropagation();

        if (this.renderItems()) {
          show(this.el);
          this.rect.update();
          this.player.rect.update();

          const { width, height } = this.rect;
          const { x, y } = this.player.rect;
          const { innerWidth, innerHeight } = window;
          const { clientX, clientY } = ev;

          let left = clientX - x;
          let top = clientY - y;

          if (clientX + width > innerWidth) left = innerWidth - width;
          if (clientY + height > innerHeight) top = innerHeight - height;

          this.applyStyle({ left: `${left}px`, top: `${top}px` });
        }
      }

      this.showed = !this.showed;
    });

    addDisposableListener(this, document, 'click', () => {
      this.showed = false;
      this.hide();
    });
  }

  private getDomNodes(): HTMLElement[] {
    return this.items.filter((x) => x && !x.invisible).map((item) => {
      const el = $('.contextmenu_item');
      if (item.show) item.show(this.player, item);
      if (item.html) el.innerHTML = item.html;
      if (item.disabled) addClass(el, 'contextmenu_item-disabled');
      if (item.checked) addClass(el, 'contextmenu_item-checked');
      if (item.click) {
        el.addEventListener('click', () => (item as any).click(this.player, item), false);
      }
      return el;
    });
  }

  private renderItems(): boolean {
    const items = this.getDomNodes();
    if (!items.length) return false;
    this.el.textContent = '';
    const frag = document.createDocumentFragment();
    items.forEach((item) => frag.appendChild(item));
    this.el.appendChild(frag);
    return true;
  }

  get isActive(): boolean {
    return this.el.style.display !== 'none';
  }

  hide = () => {
    hide(this.el);
  }
}
