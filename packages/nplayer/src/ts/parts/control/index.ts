import { EVENT } from 'src/ts/constants';
import { Player } from 'src/ts/player';
import { Disposable } from 'src/ts/types';
import { Tooltip } from 'src/ts/components/tooltip';
import {
  $, addClass, addDisposable, addDisposableListener, Component, containClass, removeClass,
} from 'src/ts/utils';
import { ControlBar } from './items';

const classHide = 'control-hide';
const classBgHide = 'control_bg-hide';
const classBarHide = 'control_bar-hide';

export interface ControlItem extends Partial<Disposable> {
  el: HTMLElement;
  id?: any;
  tip?: string;
  tooltip?: Tooltip;
  mounted?: boolean;
  init?: (player: Player, position: number, tooltip: Tooltip) => void;
  update?: (position: number) => void;
  hide?: () => void;
  isSupport?: (player: Player) => boolean;
  [key: string]: any;
}

type BpControl = { bp: number, controls: (ControlItem| string)[][] }

export class Control extends Component {
  private readonly bgElement: HTMLElement;

  private showTimer: any;

  private delayHidTime = 3000;

  private latch = 0;

  private controlBars: ControlBar[] = [];

  private controls: BpControl[]

  currentBp: number | undefined;

  constructor(container: HTMLElement, private player: Player) {
    super(container, '.control');
    this.bgElement = container.appendChild($('.control_bg'));

    this.controlBars[1] = addDisposable(this, new ControlBar(this.el, player, player.opts.controls[1], 1));
    this.controlBars[0] = addDisposable(this, new ControlBar(this.el, player, player.opts.controls[0], 0));
    this.controlBars[2] = addDisposable(this, new ControlBar(container, player, player.opts.controls[2], 2));

    const bpControls = player.opts.bpControls;
    this.controls = Object.keys(bpControls)
      .map((bp) => ({ bp: Number(bp), controls: bpControls[bp] }))
      .sort((a, b) => a.bp - b.bp);

    if (this.controls.length) {
      addDisposable(this, player.on(EVENT.UPDATE_SIZE, this.emitAndUpdateBp));
      addDisposable(this, player.on(EVENT.MOUNTED, this.emitAndUpdateBp));
    }

    addDisposable(this, player.on(EVENT.PAUSE, () => {
      if (!player.opts.isTouch) this.show();
    }));
    addDisposable(this, player.on(EVENT.PLAY, () => {
      if (!player.opts.isTouch) this.showTransient();
    }));
    addDisposableListener(this, player.el, 'mousemove', this.showTransient);
    addDisposableListener(this, player.el, 'mouseleave', this.tryHide);
    this.showTransient();
  }

  get isActive(): boolean {
    return !containClass(this.el, classHide);
  }

  private filterItems(items: ControlItem[], toFilter: ControlItem[]): ControlItem[] | undefined {
    if (items.length && toFilter.length) {
      const map = new Map();
      items.forEach((i) => map.set(i, true));
      return toFilter.filter((item) => !map.get(item));
    }
  }

  private emitAndUpdateBp = (): BpControl | undefined => {
    const width = this.player.rect.width;
    const matched = this.controls.find((c) => width <= c.bp);
    // eslint-disable-next-line eqeqeq
    if (this.currentBp != matched?.bp) {
      this.currentBp = matched?.bp;
      const controls = matched?.controls || this.player.opts.controls;
      this.updateItems(controls[0], 0);
      this.updateItems(controls[1], 1);
      this.updateItems(controls[2], 2);
      this.player.emit(EVENT.BP_CHANGE, this.currentBp);
    }
    return matched;
  }

  updateItems(items: Parameters<ControlBar['update']>[0], index = 0): void {
    const curBar = this.controlBars[index];
    if (!curBar) return;
    curBar.update(items || []);
    const barItems = curBar.getItems();
    this.controlBars.forEach((bar, i) => {
      if (i === index) return;
      bar.setItems(this.filterItems(barItems, bar.getItems()));
      bar.updateTooltipPos();
    });
  }

  require(): void {
    this.latch++;
  }

  release(): void {
    if (this.latch) {
      this.latch--;
      this.tryHide();
    }
  }

  show = (): void => {
    removeClass(this.el, classHide);
    removeClass(this.bgElement, classBgHide);
    removeClass(this.controlBars[2].el, classBarHide);
    this.player.el.style.cursor = '';
    this.player.emit(EVENT.CONTROL_SHOW);
  }

  hide = (): void => {
    addClass(this.el, classHide);
    addClass(this.bgElement, classBgHide);
    addClass(this.controlBars[2].el, classBarHide);
    this.player.el.style.cursor = 'none';
    this.player.emit(EVENT.CONTROL_HIDE);
  }

  showTransient = (): void => {
    this.show();
    clearTimeout(this.showTimer);
    this.showTimer = setTimeout(this.tryHide, this.delayHidTime);
  }

  tryHide = (): void => {
    if (this.player.video.played.length && !this.player.paused && !this.latch) {
      this.hide();
    }
  }
}
