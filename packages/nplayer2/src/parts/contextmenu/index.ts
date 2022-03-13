import type { PlayerBase } from '../../player-base';
import {
  $,
  addClass,
  addDestroyableListener, Component, hide, isString, Rect, show,
} from '../../utils';
import './index.scss';

export class Contextmenu extends Component {
  private rect: Rect;

  private showed = false;

  constructor(container: HTMLElement, private player: PlayerBase) {
    super(container, '.cm');
    this.hide();
    this.rect = new Rect(this.el, player);

    const { disabled, toggleNative, items } = player.config.contextmenu;
    if (disabled) return;

    const hasItems = items?.length;
    if (hasItems) {
      const frag = document.createDocumentFragment();
      items.forEach((x) => {
        const i = $('.cm-i');
        if (x.icon) {
          i.appendChild(isString(x.icon) ? $('', undefined, x.icon) : x.icon);
        }
        if (x.el) {
          i.appendChild(isString(x.el) ? $('span', undefined, x.el) : x.el);
        }
        if (x.disabled) addClass(i, 'cm_i-disabled');
        if (x.onClick) {
          i.onclick = () => {
            if (x.onClick) x.onClick(x, player);
          };
        }
      });
      this.el.appendChild(frag);
    }

    addDestroyableListener(this, player.el, 'contextmenu', (ev: MouseEvent) => {
      if (!toggleNative || !this.showed) {
        ev.preventDefault();
        ev.stopPropagation();
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
        this.show(left, top);
      } else {
        this.hide();
      }

      this.showed = !this.showed;
    });

    addDestroyableListener(this, document, 'click', () => {
      this.showed = false;
      this.hide();
    });
  }

  get isActive() {
    return this.el.style.display !== 'none';
  }

  show(x: number, y: number) {
    this.applyStyle({ left: `${x}px`, top: `${y}px` });
    show(this.el);
  }

  hide = () => {
    hide(this.el);
  }
}
