import { SETTINGS_MENU_ITEM } from '../../config/classname';
import { htmlDom, newElement } from '../../utils';

export default abstract class SettingItem {
  entry: HTMLElement;
  protected entryLabel: HTMLElement;
  protected entryValue: HTMLElement;

  constructor(label: string) {
    this.entry = newElement(SETTINGS_MENU_ITEM);
    this.entryLabel = htmlDom(label);
    this.entryValue = newElement('', 'span');
    this.entry.appendChild(this.entryLabel);
    this.entry.appendChild(this.entryValue);
    this.entry.addEventListener('click', this.entryClickHandler, true);
  }

  private entryClickHandler = (ev: MouseEvent): void => {
    ev.preventDefault();
    ev.stopPropagation();
    this.onEntryClick(ev);
  };

  abstract onEntryClick(ev: MouseEvent): void;
}
