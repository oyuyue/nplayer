import Component from '../../component';
import RPlayer from '../../rplayer';
declare class SettingMenu extends Component {
    private readonly items;
    private readonly homePage;
    private readonly optionPages;
    private homeRect;
    private readonly optionRects;
    constructor(player: RPlayer);
    private radioEntryClickHandler;
    private backClickHandler;
    private setWH;
    private getBack;
    private getHomePage;
    private getOptionPage;
    resetPage(): void;
    onMounted(): void;
}
export default SettingMenu;
