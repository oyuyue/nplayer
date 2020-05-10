import Component from '../../component';
export interface RadioOption {
    label: string;
    selected?: string;
    [key: string]: any;
}
export interface RadioOpts {
    label: string;
    options: RadioOption[];
    defaultValue?: number;
    onChange?: (o: RadioOption, next: () => void) => any;
}
declare class Radio extends Component {
    private prevSelect;
    private value;
    readonly opts: RadioOpts;
    private readonly options;
    private readonly entry;
    private readonly entryLabel;
    private readonly entryValue;
    private readonly onEntryClick;
    constructor(opts: RadioOpts, onEntryClick?: (radio: Radio) => any);
    private optionClickHandler;
    private select;
}
export default Radio;
