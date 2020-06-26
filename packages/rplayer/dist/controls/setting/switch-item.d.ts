export interface SwitchItemOptions {
    label?: string;
    checked?: boolean;
    onChange?: (v: boolean, update: () => void, ev: MouseEvent) => any;
}
export default class SwitchItem {
    private readonly base;
    private readonly switch;
    private readonly onChange;
    constructor(opts?: SwitchItemOptions);
    get dom(): HTMLElement;
    private onClick;
    private update;
}
//# sourceMappingURL=switch-item.d.ts.map