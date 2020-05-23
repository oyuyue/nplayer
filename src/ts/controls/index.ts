import Component from '../component';
import {
  CTRL,
  CTRL_BOTTOM,
  CTRL_BOTTOM_MASK,
  CTRL_HIDE,
  CTRL_TRAYS,
  PAUSED,
} from '../config/classname';
import Events from '../events';
import RPlayer from '../rplayer';
import { clampNeg, newElement } from '../utils';
import ContextMenu, { ContextMenuItem } from './contextmenu';
import Mask from './mask';
import ProgressBar from './progress-bar';
import Setting from './setting';
import { SelectOpts } from './setting/select';
import { SwitchOpts } from './setting/switch';
import PlayTray from './trays/play';
import Time from './trays/time';
import VolumeTray from './trays/volume';
import SettingMenu from './setting/menu';
import Tray, { ConfigTray, TrayOpts } from './trays/tray';

export default class Controls extends Component {
  private controlsTimer: NodeJS.Timeout;
  private readonly bottom: HTMLElement;
  private readonly tray: HTMLElement;
  readonly mask: Mask;
  readonly contextMenu: ContextMenu;
  readonly setting: Setting;

  private showLatch = 0;

  constructor(player: RPlayer) {
    super(player, {
      events: [
        Events.PLAY,
        Events.PAUSE,
        Events.PLAYER_MOUSE_MOVE,
        Events.PLAYER_MOUSE_LEAVE,
        Events.PLAYER_CLICK,
      ],
      className: CTRL,
    });

    if (player.paused) player.addClass(PAUSED);

    this.setting = new Setting(player);
    this.bottom = newElement(CTRL_BOTTOM);
    this.tray = newElement(CTRL_TRAYS);

    const trays = [
      new PlayTray(player),
      new VolumeTray(player),
      new Time(player),
      this.setting,
      ...player.options.trays.map((t) => new ConfigTray(t, player)),
    ];

    trays
      .sort((a, b) => a.pos - b.pos)
      .forEach((t) => this.tray.appendChild(t.dom));

    this.bottom.appendChild(new ProgressBar(player).dom);
    this.bottom.appendChild(this.tray);

    const bottomMask = newElement(CTRL_BOTTOM_MASK);
    this.mask = new Mask(player);
    this.contextMenu = new ContextMenu(player);

    this.appendChild(bottomMask);
    this.appendChild(this.bottom);
    this.appendChild(this.contextMenu);
    this.appendChild(this.mask.dom);
  }

  get isHide(): boolean {
    return this.containsClass(CTRL_HIDE);
  }

  private tryHideControls = (ev?: MouseEvent): void => {
    if (ev) ev.preventDefault();
    const media = this.player.media;

    if (media.played.length && !media.paused && !this.showLatch) {
      this.hide();
    }
  };

  requireShow(): void {
    this.showLatch++;
  }

  releaseShow(): void {
    this.showLatch--;
    if (this.showLatch < 0) this.showLatch = 0;
  }

  showTemporary(): void {
    this.show();
    clearTimeout(this.controlsTimer);
    this.controlsTimer = setTimeout(this.tryHideControls, 3000);
  }

  show(): void {
    if (!this.isHide) return;
    this.removeClass(CTRL_HIDE);
    this.player.emit(Events.CONTROLS_SHOW);
  }

  hide(): void {
    if (this.isHide) return;
    this.addClass(CTRL_HIDE);
    this.player.emit(Events.CONTROLS_HIDE);
  }

  addTray(tray: TrayOpts | Element, pos?: number): Tray | Element {
    const item =
      tray instanceof Element ? tray : new ConfigTray(tray, this.player);

    this.tray.insertBefore(
      (item as any).dom ? (item as any).dom : item,
      this.tray.children[clampNeg(pos, this.tray.children.length) + 1]
    );

    return item;
  }

  addSettingItem(
    opts: SelectOpts | SwitchOpts,
    pos?: number
  ): ReturnType<SettingMenu['addItem']> {
    return this.setting.menu.addItem(opts, pos);
  }

  addContextMenuItem(
    opts: ContextMenuItem,
    pos?: number
  ): ReturnType<ContextMenu['addItem']> {
    return this.contextMenu.addItem(opts, pos);
  }

  onPlay(): void {
    this.showTemporary();
    this.player.removeClass(PAUSED);
  }

  onPause(): void {
    this.show();
    this.player.addClass(PAUSED);
  }

  onPlayerClick(ev: Event): void {
    ev.preventDefault();
    if (!this.bottom.contains(ev.target as any)) {
      this.player.toggle();
    }
    this.showTemporary();
  }

  onPlayerMouseMove(): void {
    this.showTemporary();
  }

  onPlayerMouseLeave(): void {
    this.tryHideControls();
  }
}
