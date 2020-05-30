export default abstract class SettingItem {
    entry: HTMLElement;
    protected entryLabel: HTMLElement;
    protected entryValue: HTMLElement;
    constructor(label: string);
    private entryClickHandler;
    abstract onEntryClick(ev: MouseEvent): void;
}
//# sourceMappingURL=item.d.ts.map