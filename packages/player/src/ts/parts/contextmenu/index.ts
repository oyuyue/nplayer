import { Player } from 'src/ts/player';
import {
  $, addClass, show, hide, addDisposableListener, Rect, Component,
} from 'src/ts/utils';

export interface ContextMenuItem {
  html?: string;
  type?: 'normal' | 'separator';
  disabled?: boolean;
  invisible?: boolean;
  checked?: boolean;
  click?: (item: ContextMenuItem, player: Player) => void;
}

export class ContextMenu extends Component {
  private rect: Rect;

  constructor(
    container: HTMLElement,
    private player: Player,
    private readonly items: ContextMenuItem[],
  ) {
    super(container, '.contextmenu');
    hide(this.element);

    this.rect = new Rect(this.element);

    addDisposableListener(this, player.element, 'contextmenu', (ev: MouseEvent) => {
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
    });

    addDisposableListener(this, document, 'click', () => {
      hide(this.element);
    });
  }

  private getDomNodes(): HTMLElement[] {
    return this.items.map((item) => {
      if (item.invisible) return null;
      const el = $('.contextmenu_item');
      if (item.type === 'separator') {
        addClass(el, '.contextmenu_item-separator');
        return el;
      }
      if (item.html) el.innerHTML = item.html;
      if (item.disabled) addClass(el, '.contextmenu_item-disabled');
      if (item.checked) addClass(el, 'contextmenu_item-checked');
      if (item.click) {
        el.addEventListener('click', () => (item as any).click(item, this.player), false);
      }
      return el;
    }).filter(Boolean) as HTMLElement[];
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
}
