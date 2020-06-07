import Component from '../component';
import RPlayer from '../rplayer';
import ContextMenu, { ContextMenuItem } from './contextmenu';
import Mask from './mask';
import Setting from './setting';
import { SelectOpts } from './setting/select';
import { SwitchOpts } from './setting/switch';
import SettingMenu from './setting/menu';
import Tray, { TrayOpts } from './trays/tray';
export default class Controls extends Component {
    private controlsTimer;
    private readonly bottom;
    private readonly tray;
    readonly mask: Mask;
    readonly contextMenu: ContextMenu;
    readonly setting: Setting;
    private showLatch;
    constructor(player: RPlayer);
    get isHide(): boolean;
    private tryHideControls;
    requireShow(): void;
    releaseShow(): void;
    showTemporary(): void;
    show(): void;
    hide(): void;
    addTray(tray: TrayOpts | Element, pos?: number): Tray | Element;
    addSettingItem(opts: SelectOpts | SwitchOpts, pos?: number): ReturnType<SettingMenu['addItem']>;
    addContextMenuItem(opts: ContextMenuItem, pos?: number): ReturnType<ContextMenu['addItem']>;
    onPlay(): void;
    onPause(): void;
    onPlayerClick(ev: Event): void;
    onPlayerMouseMove(): void;
    onPlayerMouseLeave(): void;
}
//# sourceMappingURL=index.d.ts.map