import { Switch } from '../../../components/switch';
import { Player } from '../../../player';
import { Component } from '../../../utils';
import { Tooltip } from '../../../components/tooltip';
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
    _selectedElement?: HTMLElement;
    _optionElements?: HTMLElement[];
    _optionElement?: HTMLElement;
    [key: string]: any;
}
export declare class SettingPanel extends Component {
    constructor(container: HTMLElement);
}
declare class Setting extends Component implements ControlItem {
    readonly id = "settings";
    private player;
    private items;
    private homeElement;
    private popover;
    private currentOptionElement;
    tooltip: Tooltip;
    tip: string;
    init(player: Player, isTop: boolean, tooltip: Tooltip): void;
    update(isTop: boolean): void;
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
