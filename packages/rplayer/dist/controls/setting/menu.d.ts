import RPlayer from '../../rplayer';
import Select, { SelectOpts } from './select';
import Switch, { SwitchOpts } from './switch';
import EventHandler from '../../event-handler';
export default class SettingMenu extends EventHandler {
    private readonly popover;
    private readonly homePage;
    private readonly optionPages;
    private homeRect;
    private readonly optionRects;
    constructor(player: RPlayer);
    get dom(): HTMLElement;
    private selectEntryClickHandler;
    private backClickHandler;
    private setWH;
    private getBack;
    private getOptionPage;
    show(): void;
    hide(): void;
    addItem(opts: SelectOpts | SwitchOpts, pos?: number): Select | Switch;
    resetPage(): void;
    onSettingSelected(): void;
    onMounted(): void;
}
//# sourceMappingURL=menu.d.ts.map