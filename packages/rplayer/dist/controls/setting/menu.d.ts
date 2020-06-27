import RPlayer from '../../rplayer';
import Select, { SelectOptions } from './select';
import Switch, { SwitchItemOptions } from './switch-item';
import Popover from '../../widgets/popover';
import EventHandler from '../../event-handler';
export default class SettingMenu extends EventHandler {
    readonly popover: Popover;
    private readonly homePage;
    private readonly optionPages;
    private homeRect;
    private readonly optionRects;
    constructor(player: RPlayer, onHide?: () => any);
    get dom(): HTMLElement;
    private selectEntryClickHandler;
    private backClickHandler;
    private setWH;
    private getBack;
    private getOptionPage;
    show(): void;
    hide(): void;
    addItem(opts: SelectOptions | SwitchItemOptions, pos?: number): Select | Switch;
    resetPage(): void;
    onSettingSelected(): void;
    onMounted(): void;
}
//# sourceMappingURL=menu.d.ts.map