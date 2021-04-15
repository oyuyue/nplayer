import type {
  Checkbox,
  Disposable, Player, Popover, Tooltip,
} from 'nplayer';
import { BulletOption } from './danmaku/bullet';
import {
  BOTTOM, COLOR, isDefaultColor, MODE, SCROLL, SEND, SEND_SETTINGS, TOP,
} from './utils';

let utils: Player['Player']['_utils'];

export class DanmakuSendBoxControlItem implements Disposable {
  static readonly id = 'danmaku';

  private element: HTMLElement;

  readonly tip: Tooltip;

  private readonly popover: Popover;

  private readonly inputElement: HTMLInputElement;

  private readonly sendElement: HTMLElement;

  private readonly colorInputElement: HTMLInputElement;

  private readonly colorElement: HTMLElement;

  private readonly typeCBs: Record<Required<BulletOption>['type'], Checkbox> = {} as any;

  private currentType = 'scroll';

  constructor(container: HTMLElement, private player: Player) {
    const { _utils, components, I18n } = player.Player;
    utils = _utils;
    const {
      $, addDisposableListener, addDisposable, createSvg,
    } = utils;

    this.element = container.appendChild($('.danmaku_send'));
    const settingElement = this.element.appendChild($());
    settingElement.appendChild(createSvg('icon', '<path d="M9.62 14L12 7.67 14.37 14M11 5L5.5 19h2.25l1.12-3h6.25l1.13 3h2.25L13 5h-2z" />'));
    this.tip = addDisposable(this, new components.Tooltip(settingElement, I18n.t(SEND_SETTINGS)));
    this.popover = addDisposable(this, new components.Popover(settingElement, undefined, undefined, true));
    this.inputElement = this.element.appendChild($('input'));
    this.sendElement = this.element.appendChild($('.danmaku_send_btn', undefined, I18n.t(SEND)));

    const row = () => $('.flex.align-center.danmaku_row');
    const panelElement = this.popover.panelElement;
    let rowElement = $('.danmaku_row');
    panelElement.appendChild(rowElement);
    rowElement.appendChild($(undefined, undefined, I18n.t(MODE)));
    rowElement = rowElement.appendChild($('.flex.align-center'));
    this.typeCBs.scroll = addDisposable(this, new components.Checkbox(rowElement, { html: I18n.t(SCROLL), checked: true, change: this.onTypeChange('scroll') }));
    this.typeCBs.top = addDisposable(this, new components.Checkbox(rowElement, { html: I18n.t(TOP), change: this.onTypeChange('top') }));
    this.typeCBs.bottom = addDisposable(this, new components.Checkbox(rowElement, { html: I18n.t(BOTTOM), change: this.onTypeChange('bottom') }));
    rowElement = row();
    rowElement = $('.danmaku_row');
    panelElement.appendChild(rowElement);
    rowElement.appendChild($(undefined, undefined, I18n.t(COLOR)));
    rowElement = rowElement.appendChild($('.danmaku_color_row'));
    this.colorInputElement = rowElement.appendChild($('input'));
    addDisposableListener(this, this.colorInputElement, 'input', () => {
      this.updateColor(this.colorInputElement.value);
    });
    this.colorElement = rowElement.appendChild($('.danmaku_color_preview'));
    rowElement = $('.danmaku_colors');
    addDisposableListener(this, rowElement, 'click', ({ target }: MouseEvent) => {
      const el = target as HTMLElement;
      if (el && el.dataset.value) {
        this.updateColor(el.dataset.value);
      }
    });
    let colorItem;
    player.danmaku.opts.colors.forEach((c) => {
      colorItem = $('.danmaku_color');
      colorItem.style.background = c;
      colorItem.dataset.value = c;
      rowElement.appendChild(colorItem);
    });
    panelElement.appendChild(rowElement);

    addDisposableListener(this, settingElement, 'click', this.show);
    addDisposableListener(this, this.inputElement, 'keypress', (ev: KeyboardEvent) => {
      if (ev.altKey || ev.ctrlKey || ev.metaKey || ev.shiftKey) return;
      const code = ev.keyCode || ev.which;
      if (code !== 13) return;
      this.send();
    });
    addDisposableListener(this, this.inputElement, 'focus', () => player.control.require());
    addDisposableListener(this, this.inputElement, 'blur', () => player.control.release());
    addDisposableListener(this, this.sendElement, 'click', this.send);

    this.updateColor('#FFFFFF');
  }

  private onTypeChange = (type: Required<BulletOption>['type']) => () => {
    this.currentType = type;
    this.typeCBs.scroll.update(false);
    this.typeCBs.top.update(false);
    this.typeCBs.bottom.update(false);
    this.typeCBs[type].update(true);
  }

  updateColor(v: string) {
    this.colorInputElement.value = v;
    this.colorElement.style.background = v;
    this.inputElement.style.color = v;
  }

  show = (ev?: MouseEvent) => {
    if (ev && utils.getEventPath(ev).includes(this.popover.element)) return;
    this.tip.hide();
    this.popover.show();
  }

  send = () => {
    const value = this.inputElement.value;
    if (!value) return;
    this.inputElement.value = '';
    const bullet: BulletOption = {
      text: value,
      time: this.player.currentTime,
      type: this.currentType as any,
      color: isDefaultColor(value) ? undefined : this.colorInputElement.value,
    };
    this.player.danmaku.send(bullet);
  }

  dispose() {
    if (!this.player) return;
    utils.dispose(this);
    utils.removeNode(this.element);
    this.player = null!;
    this.element = null!;
  }
}
