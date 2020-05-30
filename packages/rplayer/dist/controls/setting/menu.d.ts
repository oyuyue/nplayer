import Component from '../../component';
import RPlayer from '../../rplayer';
import Select, { SelectOpts } from './select';
import Switch, { SwitchOpts } from './switch';
export default class SettingMenu extends Component {
    private readonly homePage;
    private readonly optionPages;
    private homeRect;
    private readonly optionRects;
    constructor(player: RPlayer);
    private selectEntryClickHandler;
    private backClickHandler;
    private setWH;
    private getBack;
    private getOptionPage;
    addItem(opts: SelectOpts | SwitchOpts, pos?: number): Select | Switch;
    resetPage(): void;
    onSettingSelected(): void;
    onMounted(): void;
}
//# sourceMappingURL=menu.d.ts.map