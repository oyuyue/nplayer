export interface SwitchOpts {
    label: string;
    defaultValue?: boolean;
    onChange?: (v: boolean, next: () => void) => any;
}
declare class Switch {
    private value;
    private readonly opts;
    private readonly entry;
    private readonly entryLabel;
    private readonly entryValue;
    private readonly activeClass;
    constructor(opts: SwitchOpts);
    private entryClickHandler;
    private doSwitch;
}
export default Switch;
