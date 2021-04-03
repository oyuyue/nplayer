import type {
  Player, Popover, Tooltip, Checkbox, Slider,
} from 'player';

export class DanmakuSettingControlItem {
  static readonly id = 'danmaku-setting'

  private readonly element: HTMLElement;

  readonly tip: Tooltip;

  private readonly popover: Popover;

  private scrollCB!: Checkbox;

  private topCB!: Checkbox;

  private bottomCB!: Checkbox;

  private colorCB!: Checkbox;

  private unlimitedCB!: Checkbox;

  private bottomUpCB!: Checkbox;

  private opacitySlider!: Slider;

  private areaSlider!: Slider;

  private speedSlider!: Slider;

  private fontsizeSlider!: Slider;

  constructor(container: HTMLElement, private player: Player) {
    const { _utils, _components } = player.Player;
    const { $, strToDom, clamp } = _utils;

    this.element = container.appendChild($());
    this.element.appendChild(strToDom('<svg class="rplayer_icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M9,22V24H7V22H9M13,22V24H11V22H13M17,22V24H15V22H17M20,20H4A2,2 0 0,1 2,18V6A2,2 0 0,1 4,4H20A2,2 0 0,1 22,6V18A2,2 0 0,1 20,20M11,13H9V15H11V13M19,13H13V15H19V13M7,9H5V11H7V9M19,9H9V11H19V9Z" /></svg>'));
    this.tip = new _components.Tooltip(this.element);
    this.popover = new _components.Popover(this.element);

    _utils.addDisposableListener(this, this.element, 'click', this.show);

    const panelElement = this.popover.panelElement;
    _utils.addClass(panelElement, 'danmaku_setting');

    player.on('mounted', () => {
      const row = () => $('.flex.align-center.danmaku_row');

      let rowElement = row();
      rowElement.appendChild($('.danmaku_onoff_label', undefined, '开/关'));
      new _components.Switch(rowElement, player.danmaku.enabled, (v) => player.danmaku[v ? 'enable' : 'disable']());
      const resetBtn = rowElement.appendChild($('.danmaku_reset', undefined, '恢复默认设置'));
      resetBtn.addEventListener('click', () => {
        player.danmaku.resetOptions();
        this.update();
      });
      panelElement.appendChild(rowElement);
      rowElement = $('.danmaku_row');
      panelElement.appendChild(rowElement);
      rowElement.appendChild($(undefined, undefined, '按类型屏蔽'));
      rowElement = rowElement.appendChild($('.flex.align-center'));
      this.scrollCB = new _components.Checkbox(rowElement, {
        html: '滚动',
        change(v) {
          player.danmaku[v ? 'blockType' : 'allowType']('scroll');
        },
      });
      this.topCB = new _components.Checkbox(rowElement, {
        html: '顶部',
        change(v) {
          player.danmaku[v ? 'blockType' : 'allowType']('top');
        },
      });
      this.bottomCB = new _components.Checkbox(rowElement, {
        html: '底部',
        change(v) {
          player.danmaku[v ? 'blockType' : 'allowType']('bottom');
        },
      });
      this.colorCB = new _components.Checkbox(rowElement, {
        html: '彩色',
        change(v) {
          player.danmaku[v ? 'blockType' : 'allowType']('color');
        },
      });
      rowElement = row();
      rowElement.appendChild($(undefined, undefined, '不透明度'));
      this.opacitySlider = new _components.Slider(rowElement, {
        stops: [{ value: 0, html: '10%' }, { value: 1, html: '100%' }],
        change(value) {
          player.danmaku.updateOpacity(clamp(value + 0.1, 0.1, 1));
        },
      });
      panelElement.appendChild(rowElement);
      rowElement = row();
      rowElement.appendChild($(undefined, undefined, '显示区域'));
      this.areaSlider = new _components.Slider(rowElement, {
        stops: [{ value: 0, html: '1/4' }, { value: 0.33, html: '半屏' }, { value: 0.66, html: '3/4' }, { value: 1, html: '全屏' }],
        step: true,
        change(v) {
          v = v === 0 ? 0.25 : v === 0.33 ? 0.5 : v === 0.66 ? 0.75 : 1;
          player.danmaku.updateArea(v as any);
        },
      });
      panelElement.appendChild(rowElement);
      rowElement = row();
      rowElement.appendChild($(undefined, undefined, '弹幕速度'));
      this.speedSlider = new _components.Slider(rowElement, {
        stops: [{ value: 0, html: '慢' }, { value: 1, html: '快' }],
        change(v) {
          player.danmaku.updateSpeed(clamp(-v + 1.5, 0.5, 1.5));
        },
      });
      panelElement.appendChild(rowElement);
      rowElement = row();
      rowElement.appendChild($(undefined, undefined, '字体大小'));
      this.fontsizeSlider = new _components.Slider(rowElement, {
        stops: [{ value: 0, html: '小' }, { value: 1, html: '大' }],
        change(v) {
          player.danmaku.updateFontsize(clamp(v + 0.5, 0.5, 1.5));
        },
      });
      panelElement.appendChild(rowElement);
      rowElement = row();
      this.unlimitedCB = new _components.Checkbox(rowElement, { html: '不限弹幕', change(v) { player.danmaku.updateUnlimited(v); } });
      this.bottomUpCB = new _components.Checkbox(rowElement, { html: '从下到上', change(v) { player.danmaku.updateBottomUp(v); } });
      panelElement.appendChild(rowElement);

      this.update();
    });
  }

  update() {
    const opts = this.player.danmaku.opts;
    this.scrollCB.update(opts.blocked.includes('scroll'));
    this.topCB.update(opts.blocked.includes('top'));
    this.bottomCB.update(opts.blocked.includes('bottom'));
    this.colorCB.update(opts.blocked.includes('color'));
    this.unlimitedCB.update(opts.unlimited);
    this.bottomUpCB.update(opts.bottomUp);
    this.opacitySlider.update(opts.opacity);
    this.areaSlider.update({
      0.25: 0, 0.5: 0.33, 0.75: 0.66, 1: 1,
    }[opts.area]);
    this.speedSlider.update(opts.speed - 0.5);
    this.fontsizeSlider.update(opts.fontsizeScale - 0.5);
  }

  show = () => {
    this.popover.show();
    this.tip.hide();
  }
}
