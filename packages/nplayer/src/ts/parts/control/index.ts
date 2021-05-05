import { EVENT } from 'src/ts/constants';
import { Player } from 'src/ts/player';
import { Disposable } from 'src/ts/types';
import { Tooltip } from 'src/ts/components/tooltip';
import {
  $, addClass, addDisposable, addDisposableListener, Component, containClass, removeClass,
} from 'src/ts/utils';
import { ControlBar } from './items';
// import { Progress } from './progress';

const classHide = 'control-hide';
const classBgHide = 'control_bg-hide';
const classBarHide = 'control_bar-hide';

export interface ControlItem extends Partial<Disposable> {
  element: HTMLElement;
  id?: any;
  tip?: string;
  tooltip?: Tooltip;
  mounted?: boolean;
  init?: (player: Player, isTop: boolean, tooltip: Tooltip) => void;
  update?: (isTop: boolean) => void;
  isSupport?: (player: Player) => boolean;
  [key: string]: any;
}

export class Control extends Component {
  private readonly bgElement: HTMLElement;

  private showTimer: any;

  private delayHidTime = 3000;

  private latch = 0;

  private controlBar: ControlBar;

  private topControlBar: ControlBar;

  constructor(container: HTMLElement, private player: Player) {
    super(container, '.control');
    this.bgElement = container.appendChild($('.control_bg'));

    // if (!player.opts.live) addDisposable(this, new Progress(this.element, player));
    this.controlBar = addDisposable(this, new ControlBar(this.element, player, player.opts.controls));
    this.topControlBar = addDisposable(this, new ControlBar(container, player, player.opts.topControls, true));

    addDisposable(this, player.on(EVENT.PAUSE, () => {
      if (!player.opts.isTouch) this.show();
    }));
    addDisposable(this, player.on(EVENT.PLAY, () => {
      if (!player.opts.isTouch) this.showTransient();
    }));
    addDisposableListener(this, player.element, 'mousemove', this.showTransient);
    addDisposableListener(this, player.element, 'mouseleave', this.tryHide);

    this.showTransient();
  }

  get isActive(): boolean {
    return !containClass(this.element, classHide);
  }

  private filterItems(items: ControlItem[], toFilter: ControlItem[]): ControlItem[] | undefined {
    if (items.length && toFilter.length) {
      const map = new Map();
      items.forEach((i) => map.set(i, true));
      return toFilter.filter((item) => !map.get(item));
    }
  }

  updateItems(items: Parameters<ControlBar['update']>[0]): void {
    this.controlBar.update(items);
    this.topControlBar.setItems(
      this.filterItems(
        this.controlBar.getItems(),
        this.topControlBar.getItems(),
      ),
    );
    this.topControlBar.updateTooltipPos();
  }

  updateTopItems(items: Parameters<ControlBar['update']>[0]): void {
    this.topControlBar.update(items);
    this.controlBar.setItems(
      this.filterItems(
        this.topControlBar.getItems(),
        this.controlBar.getItems(),
      ),
    );
    this.controlBar.updateTooltipPos();
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
    removeClass(this.element, classHide);
    removeClass(this.bgElement, classBgHide);
    removeClass(this.topControlBar.element, classBarHide);
    this.player.element.style.cursor = '';
    this.player.emit(EVENT.CONTROL_SHOW);
  }

  hide = (): void => {
    addClass(this.element, classHide);
    addClass(this.bgElement, classBgHide);
    addClass(this.topControlBar.element, classBarHide);
    this.player.element.style.cursor = 'none';
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
