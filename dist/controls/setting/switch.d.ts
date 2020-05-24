import SettingItem from './item';
export interface SwitchOpts {
    label: string;
    checked?: boolean;
    onChange?: (v: boolean, update: () => void, ev: MouseEvent) => any;
}
export default class Switch extends SettingItem {
    private value;
    private readonly opts;
    constructor(opts: SwitchOpts);
    private switch;
    onEntryClick(ev: MouseEvent): void;
}
