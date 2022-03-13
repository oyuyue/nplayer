import { ListItem } from '../../types';
import {
  clz, Component, $, isString, removeClass, addClass,
} from '../../utils';
import './index.scss';

const cls = clz('list');
const clsI = cls('i');
const clsA = cls('i-a', '_', false);

export class List extends Component {
  private selectedEl!: HTMLElement;

  private listEl!: HTMLElement;

  private selected?: ListItem;

  private onItemClick!: (item: ListItem) => void;

  constructor(onItemClick?: List['onItemClick']) {
    super(undefined, '.list');
    this.selectedEl = this.el.appendChild($(cls('select')));
    this.listEl = this.el.appendChild($(cls('items')));
    if (onItemClick) this.onItemClick = onItemClick;
  }

  setClickCb(onItemClick: List['onItemClick']) {
    this.onItemClick = onItemClick;
  }

  update(list: ListItem[]) {
    this.listEl.innerHTML = '';
    this.selected = undefined;
    const frag = document.createDocumentFragment();
    list.forEach((x) => {
      x.el = x.el || $(clsI);
      x.el.appendChild(isString(x.label) ? $('span', undefined, x.label) : x.label);
      x.el.onclick = () => {
        if (x === this.selected) return;
        this.onItemClick(x);
      };
      frag.appendChild(x.el);
    });

    this.listEl.appendChild(frag);
  }

  select(item: ListItem) {
    if (this.selected && this.selected.el) removeClass(this.selected.el, clsA);
    this.selected = item;
    if (item.el) addClass(item.el, clsA);
    const selected = item.selected || item.label;
    const isS = isString(selected);
    this.selectedEl.innerHTML = isS ? selected : '';
    if (!isS) {
      this.selectedEl.appendChild(selected);
    }
  }
}
