import type { ControlItem, Destroyable } from '../../types';
import type { PlayerBase } from '../../player-base';
import { EVENT } from '../../constants';
import {
  Component, $, addDestroyable, addDestroyableListener, removeClass, addClass, callAndRemoveDestroyable, containClass, hide,
} from '../../utils';
import { ControlBar } from './control-bar';
import './index.scss';

const classHide = 'ctrl-hide';
const classBgHide = 'ctrl_bg-hide';
const classBarHide = 'ctrl_bar-hide';

type BpControl = { bp: number, controls: (ControlItem| string)[][] }

export class Control extends Component {
  private readonly bgEl: HTMLElement;

  private readonly bgTopEl: HTMLElement;

  private controlBars: ControlBar[] = [];

  private showTimer: any;

  private latch = 0;

  private controls: BpControl[]

  private currentBp: number | undefined;

  private destroyableArr?: Destroyable[];

  constructor(container: HTMLElement, private player: PlayerBase) {
    super(container, '.ctrl');

    const config = this.player.config.control;
    const items = config.items || [];
    this.controlBars[1] = addDestroyable(this, new ControlBar(this.el, player, 1, items[1]));
    this.controlBars[0] = addDestroyable(this, new ControlBar(this.el, player, 0, items[0]));
    this.controlBars[2] = addDestroyable(this, new ControlBar(container, player, 2, items[2]));
    this.bgEl = container.appendChild($('.ctrl_bg'));
    this.bgTopEl = container.appendChild($('.ctrl_bg.ctrl_bg-top'));
    if (!items[2] || !items[2].length) hide(this.bgTopEl);

    const bpItems = config.bpItems || {};
    this.controls = Object.keys(bpItems)
      .map((bp) => ({ bp: Number(bp), controls: bpItems[bp] }))
      .sort((a, b) => b.bp - a.bp);

    if (this.controls.length) {
      addDestroyable(this, player.on(EVENT.RESIZE, this.onResize));
      addDestroyable(this, player.on(EVENT.MOUNTED, this.onResize));
    }

    if (!config.disabled) {
      this.enable();
    }

    this.hide();
  }

  get isShowing() {
    return !containClass(this.el, classHide);
  }

  show = () => {
    removeClass(this.el, classHide);
    removeClass(this.bgEl, classBgHide);
    removeClass(this.bgTopEl, classBgHide);
    removeClass(this.controlBars[2].el, classBarHide);
    this.player.el.style.cursor = '';
    this.player.emit(EVENT.CONTROL_SHOW, this.player);
  }

  hide = () => {
    addClass(this.el, classHide);
    addClass(this.bgEl, classBgHide);
    addClass(this.bgTopEl, classBgHide);
    addClass(this.controlBars[2].el, classBarHide);
    this.player.el.style.cursor = 'none';
    this.player.emit(EVENT.CONTROL_HIDE, this.player);
  }

  showThenHide = () => {
    this.show();
    clearTimeout(this.showTimer);
  }

  tryHide = () => {
    if (!this.player.paused && !this.latch) {
      this.hide();
    }
  }

  require() {
    this.latch++;
  }

  release() {
    if (this.latch) {
      this.latch--;
      this.tryHide();
    }
  }

  enable() {
    const player = this.player;
    this.destroyableArr = [
      addDestroyable(this, player.on(EVENT.PAUSE, this.show)),
      addDestroyable(this, player.on(EVENT.PLAY, this.showThenHide)),
      addDestroyableListener(this, player.el, 'mousemove', this.showThenHide),
      addDestroyableListener(this, player.el, 'mouseleave', this.tryHide),
    ];
  }

  disable() {
    if (this.destroyableArr) {
      this.destroyableArr.forEach((x) => {
        callAndRemoveDestroyable(this, x);
      });
    }
  }

  updateItems(items: Parameters<ControlBar['update']>[0], index = 0): void {
    const curBar = this.controlBars[index];
    if (!curBar) return;
    curBar.update(items || []);
    const barItems = curBar.getItems();
    this.controlBars.forEach((bar, i) => {
      if (i === index) return;
      bar.setItems(this.filterItems(barItems, bar.getItems()));
    });
  }

  private filterItems(items: ControlItem[], toFilter: ControlItem[]): ControlItem[] | undefined {
    if (items.length && toFilter.length) {
      const map = new Map();
      items.forEach((i) => map.set(i, true));
      return toFilter.filter((item) => !map.get(item));
    }
  }

  private onResize = () => {
    const width = this.player.rect.width;
    const matched = this.controls.find((c) => width <= c.bp);
    // eslint-disable-next-line eqeqeq
    if (this.currentBp != matched?.bp) {
      this.currentBp = matched?.bp;
      const controls = matched?.controls || this.player.config.control.items || [];
      this.updateItems(controls[0], 0);
      this.updateItems(controls[1], 1);
      this.updateItems(controls[2], 2);
    }
  }
}
