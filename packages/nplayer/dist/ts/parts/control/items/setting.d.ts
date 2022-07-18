import { Switch } from 'src/ts/components/switch';
import { Player } from 'src/ts/player';
import { Component } from 'src/ts/utils';
import { Tooltip } from 'src/ts/components/tooltip';
import { ControlItem } from '..';
export interface SettingItemOption<T = any> {
    html?: string;
    selectedHtml?: string;
    value?: T;
}
export interface SettingItem<T = any> {
    id?: string;
    html?: string;
    type?: 'switch' | 'select';
    checked?: boolean;
    options?: SettingItemOption<T>[];
    value?: T;
    init?: (player: Player, item: SettingItem) => void;
    change?: (value: T, player: Player, item: SettingItem) => void;
    _switch?: Switch;
    _selectedEl?: HTMLElement;
    _optionEls?: HTMLElement[];
    _optionEl?: HTMLElement;
    [key: string]: any;
}
export declare class SettingPanel extends Component {
    constructor(container: HTMLElement);
}
declare class Setting extends Component implements ControlItem {
    readonly id = "settings";
    private player;
    private items;
    private homeEl;
    private popover;
    private currentOptionEl;
    private probeEl;
    tooltip: Tooltip;
    tip: string;
    init(player: Player, position: number, tooltip: Tooltip): void;
    update(position: number): void;
    private setPos;
    private renderHome;
    private renderOptions;
    private onItemClick;
    private onOptionClick;
    private back;
    private showOptionPage;
    private showHomePage;
    show: (ev?: MouseEvent | undefined) => void;
    hide: (ev?: MouseEvent | undefined) => void;
}
export declare const settingControlItem: () => Setting;
export {};
