import { Switch } from '../../../components/switch';
import { Player } from '../../../player';
import { Component } from '../../../utils';
import { Tooltip } from '../../../components/tooltip';
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
export declare class SettingPanelOption extends Component {
}
export declare class SettingPanelHome extends Component {
}
export declare class SettingPanel extends Component {
    constructor(container: HTMLElement);
}
export declare class SettingControlItem extends Component {
    private player;
    static readonly id = "settings";
    readonly tip: Tooltip;
    private readonly items;
    private readonly homeElement;
    private readonly popover;
    private currentOptionElement;
    constructor(container: HTMLElement, player: Player);
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
