import { htmlDom, newElement } from '../../utils';

abstract class SettingItem {
  entry: HTMLElement;
  protected entryLabel: HTMLElement;
  protected entryValue: HTMLElement;

  constructor(label: string) {
    this.entry = newElement();
    this.entry.classList.add('rplayer_sets_menu_item');
    this.entryLabel = htmlDom(label);
    this.entryValue = newElement('span');
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

export default SettingItem;
