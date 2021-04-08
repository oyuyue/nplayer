import type {
  Checkbox,
  Disposable, Player, Popover, Tooltip,
} from 'player';
import { BulletOption } from './danmaku/bullet';
import { isDefaultColor } from './utils';

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
    const { _utils, _components } = player.Player;
    utils = _utils;
    const {
      $, strToDom, addDisposableListener, addDisposable,
    } = utils;

    this.element = container.appendChild($('.danmaku_send'));
    const settingElement = this.element.appendChild($());
    settingElement.appendChild(strToDom('<svg class="rplayer_icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M9.62,12L12,5.67L14.37,12M11,3L5.5,17H7.75L8.87,14H15.12L16.25,17H18.5L13,3H11Z" /></svg>'));
    this.tip = addDisposable(this, new _components.Tooltip(settingElement, '发送设置'));
    this.popover = addDisposable(this, new _components.Popover(settingElement, undefined, undefined, true));
    this.inputElement = this.element.appendChild($('input'));
    this.sendElement = this.element.appendChild($('.danmaku_send_btn', undefined, '发送'));

    const row = () => $('.flex.align-center.danmaku_row');
    const panelElement = this.popover.panelElement;
    let rowElement = $('.danmaku_row');
    panelElement.appendChild(rowElement);
    rowElement.appendChild($(undefined, undefined, '模式'));
    rowElement = rowElement.appendChild($('.flex.align-center'));
    this.typeCBs.scroll = addDisposable(this, new _components.Checkbox(rowElement, { html: '滚动', checked: true, change: this.onTypeChange('scroll') }));
    this.typeCBs.top = addDisposable(this, new _components.Checkbox(rowElement, { html: '顶部', change: this.onTypeChange('top') }));
    this.typeCBs.bottom = addDisposable(this, new _components.Checkbox(rowElement, { html: '底部', change: this.onTypeChange('bottom') }));
    rowElement = row();
    rowElement = $('.danmaku_row');
    panelElement.appendChild(rowElement);
    rowElement.appendChild($(undefined, undefined, '颜色'));
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
