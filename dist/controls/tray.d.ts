import Component from '../component';
import RPlayer from '../rplayer';
declare abstract class Tray extends Component {
    protected readonly tip: HTMLElement;
    constructor(player?: RPlayer, ...events: string[]);
    private __onclick;
    abstract onClick(ev?: MouseEvent): any;
    setLeft(): void;
    setRight(): void;
    changeTipText(text: string): void;
}
export default Tray;
