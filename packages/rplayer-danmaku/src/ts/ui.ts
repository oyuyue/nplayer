import Danmaku from '.';
import RPlayer from 'rplayer';
import dan from '../icons/dan.svg';
import font from '../icons/font.svg';
import Slider from 'rplayer/dist/widgets/slider';
import Switch from 'rplayer/dist/widgets/switch';
import Checkbox from 'rplayer/dist/widgets/checkbox';
import Popover from 'rplayer/dist/widgets/popover';

export default class UI {
  private static readonly trayActiveCls = 'rplayer_dan_tray-active';
  private readonly tray: InstanceType<typeof RPlayer.Tray>;
  private readonly popover: InstanceType<typeof RPlayer.Popover>;
  private readonly danmaku: Danmaku;
  private readonly dom: HTMLElement;

  private onOffSwitch: Switch;
  private blockCheckboxes: Checkbox[] = [];
  private opacitySlider: Slider;
  private areaSlider: Slider;
  private speedSlider: Slider;
  private fontSlider: Slider;
  private otherCheckboxes: Checkbox[] = [];

  private sendPopover: Popover;
  private sendInput: HTMLInputElement;
  private readonly sendTypes: HTMLElement[] = [];
  private readonly sendColors: HTMLElement[] = [];
  private static readonly typeActiveCls = 'rplayer_dan_send_type-active';
  private static readonly colorActiveCls = 'rplayer_dan_send_color-active';

  constructor(danmaku: Danmaku) {
    this.danmaku = danmaku;
    this.dom = RPlayer.utils.newElement('rplayer_dan_send');

    this.tray = new RPlayer.Tray({
      label: '弹幕',
      icons: [RPlayer.utils.svgToDom(dan, 'rplayer_dan_icon')],
      onClick: this.onTrayClick,
    });

    this.popover = new RPlayer.Popover({
      player: this.danmaku.player,
      onHide: this.onTrayHide,
      cls: 'rplayer_dan_pop',
    });
    this.popover.mount(this.tray.dom);

    this.initPopover();
    this.updatePopoverUI();
    this.danmaku.player.controls.addTray(this.tray.dom, 3);

    if (!danmaku.opts.hideSend) this.initSend();
    this.danmaku.player.controls.addTray(this.dom, 3);

    requestAnimationFrame(this.checkSendUI);
    this.danmaku.player.on(RPlayer.Events.PLAYER_RESIZE, this.onResize);
  }

  hideSend(): void {
    this.dom.hidden = true;
  }

  showSend(): void {
    this.dom.hidden = false;
  }

  destroy(): void {
    if (this.danmaku.player) {
      this.danmaku.player.off(RPlayer.Events.PLAYER_RESIZE, this.onResize);
    }

    if (this.dom.parentNode) {
      this.dom.parentNode.removeChild(this.dom);
    }

    this.onOffSwitch.destroy();
    this.blockCheckboxes.forEach((x) => x.destroy());
    this.otherCheckboxes.forEach((x) => x.destroy());
    this.opacitySlider.destroy();
    this.areaSlider.destroy();
    this.speedSlider.destroy();
    this.fontSlider.destroy();
    this.tray.destroy();
  }

  private onResize = (): void => {
    this.checkSendUI();
    if (!this.opacitySlider) return;
    this.opacitySlider.updateRect();
    this.areaSlider.updateRect();
    this.speedSlider.updateRect();
    this.fontSlider.updateRect();
  };

  private checkSendUI = (): void => {
    const { width } = this.dom.getBoundingClientRect();
    if (width < 170) {
      if (width === 0 && this.danmaku.player.rect.width > 500) {
        this.showSend();
      } else {
        this.hideSend();
      }
    } else {
      this.showSend();
    }
  };

  private onSendTrayClick = (): void => {
    this.sendPopover.show();
  };

  private onSendFocus = (): void => {
    this.danmaku.player.controls.requireShow();
  };
  private onSendBlur = (): void => {
    this.danmaku.player.controls.releaseShow();
  };
  private onSendInput = (): void => {
    this.sendInput.value = this.sendInput.value.slice(
      0,
      this.danmaku.opts.maxLen
    );
  };
  private onSendKeypress = (ev: KeyboardEvent): void => {
    if (ev.altKey || ev.ctrlKey || ev.metaKey || ev.shiftKey) return;
    const code = ev.keyCode ? ev.keyCode : ev.which;
    if (!RPlayer.utils.isNum(code) || code !== 13) return;
    const v = this.sendInput.value;
    if (!v) return;
    const opts = this.danmaku.opts;
    const dan = {
      text: v,
      time: Math.round(this.danmaku.player.currentTime),
      color: opts.colors[opts.color],
      type: Danmaku.typeMap[opts.type],
      isMe: true,
    };
    this.danmaku.send(dan);
    this.sendInput.value = '';
  };

  private selectSendType(i: number): void {
    if (!this.sendTypes[i]) return;
    this.sendTypes.forEach((x) => {
      x.classList.remove(UI.typeActiveCls);
    });
    this.sendTypes[i].classList.add(UI.typeActiveCls);
    this.danmaku.opts.type = i;
    this.danmaku.persistSetting();
  }

  private selectSendColor(i: number): void {
    if (!this.sendColors[i]) return;
    this.sendColors.forEach((x) => {
      x.classList.remove(UI.colorActiveCls);
    });
    this.sendColors[i].classList.add(UI.colorActiveCls);
    this.dom.style.color = this.danmaku.opts.colors[i] || '#fff';
    this.danmaku.opts.color = i;
    this.danmaku.persistSetting();
  }

  private onSendTypeClick = (i: number) => (): void => this.selectSendType(i);
  private onSendColorClick = (i: number) => (): void => this.selectSendColor(i);

  private onOnOffChange = (): void => {
    this.danmaku.toggle();
    if (this.danmaku.opts.on) {
      this.tray.enable();
    } else {
      this.tray.disable();
    }
  };

  private onResetClick = (): void => {
    this.danmaku.resetSetting();
    this.updatePopoverUI();
  };

  private onBlockTypeChange = (type: string) => (v: boolean): void => {
    let types = this.danmaku.opts.blockTypes;
    if (v && types.indexOf(type as any) === -1) {
      types.push(type as any);
    }

    if (!v) {
      types = types.filter((t) => t !== type);
    }

    this.danmaku.updateBlockTypes(types);
  };

  private onOpacityChange = (v: number, d: Function): void => {
    d(true);
    this.danmaku.updateOpacity((v * 9) / 10 + 0.1);
  };

  private onAreaChange = (v: number, d: Function): void => {
    d(true);
    this.danmaku.updateArea(
      v < 0.2 ? 0.25 : v < 0.5 ? 0.5 : v < 0.8 ? 0.75 : 1
    );
  };

  private onSpeedChange = (v: number, d: Function): void => {
    d(true);
    this.danmaku.updateSpeed(v + 0.5);
  };

  private onFontChange = (v: number, d: Function): void => {
    d(true);
    this.danmaku.updateFontSize(v + 0.5);
  };

  private onUnlimitedChange = (v: boolean): void => {
    this.danmaku.updateUnlimited(v);
  };

  private onBottomUpChange = (v: boolean): void => {
    this.danmaku.updateBottomUp(v);
  };

  private onMergeChange = (v: boolean): void => {
    this.danmaku.updateMerge(v);
  };

  private onTrayClick = (): void => {
    this.tray.dom.classList.add(UI.trayActiveCls);
    this.popover.show();
  };

  private onTrayHide = (): void => {
    this.tray.dom.classList.remove(UI.trayActiveCls);
  };

  private initSend(): void {
    const icon = new RPlayer.Tray({
      icons: [RPlayer.utils.svgToDom(font)],
      noHoverBg: true,
      onClick: this.onSendTrayClick,
    });

    this.sendInput = RPlayer.utils.newElement('', 'input');
    this.sendInput.setAttribute(
      'placeholder',
      this.danmaku.opts.sendPlaceholder
    );
    this.sendInput.addEventListener('focus', this.onSendFocus);
    this.sendInput.addEventListener('blur', this.onSendBlur);
    this.sendInput.addEventListener('input', this.onSendInput);
    this.sendInput.addEventListener('keypress', this.onSendKeypress);

    this.sendPopover = new RPlayer.Popover({
      player: this.danmaku.player,
      cls: 'rplayer_dan_pop',
      left: true,
    });
    this.sendPopover.mount(icon.dom);

    const type = RPlayer.utils.newElement();
    const typeLabel = this.newSettingLabel('模式');
    const typeContent = RPlayer.utils.newElement('rplayer_dan_send_type');
    ['滚动', '顶部', '底部'].forEach((x, i) => {
      const item = RPlayer.utils.newElement();
      item.innerText = x;
      typeContent.appendChild(item);
      item.addEventListener('click', this.onSendTypeClick(i));
      this.sendTypes.push(item);
    });
    this.selectSendType(this.danmaku.opts.type);
    type.appendChild(typeLabel);
    type.appendChild(typeContent);

    const color = RPlayer.utils.newElement();
    const colorLabel = this.newSettingLabel('颜色');
    const colorContent = RPlayer.utils.newElement('rplayer_dan_send_color');
    this.danmaku.opts.colors.forEach((x, i) => {
      const item = RPlayer.utils.newElement();
      x = x || '#fff';
      item.style.color = x;
      item.style.background = x;
      this.sendColors.push(item);
      colorContent.appendChild(item);
      item.addEventListener('click', this.onSendColorClick(i));
    });
    this.selectSendColor(this.danmaku.opts.color);
    color.appendChild(colorLabel);
    color.appendChild(colorContent);

    this.sendPopover.append(type);
    this.sendPopover.append(color);

    this.dom.appendChild(icon.dom);
    this.dom.appendChild(this.sendInput);
  }

  private newSettingItem(cls?: string): HTMLElement {
    const d = RPlayer.utils.newElement('rplayer_dan_setting_item');
    if (cls) d.classList.add(cls);
    return d;
  }

  private newSliderItem(label: string, slider: Slider): HTMLElement {
    const s = RPlayer.utils.newElement('rplayer_dan_setting_slider');
    const l = RPlayer.utils.newElement();
    l.innerText = label;
    s.appendChild(l);
    slider.mount(s);
    return s;
  }

  private newSettingLabel(text: string, cls?: string): HTMLElement {
    const div = RPlayer.utils.newElement();
    div.innerText = text;
    if (cls) div.classList.add(cls);
    return div;
  }

  updatePopoverUI(): void {
    if (!this.danmaku) return;
    const opts = this.danmaku.opts;

    this.onOffSwitch.update(opts.on);
    this.blockCheckboxes[0].update(opts.blockTypes.indexOf('scroll') > -1);
    this.blockCheckboxes[1].update(opts.blockTypes.indexOf('top') > -1);
    this.blockCheckboxes[2].update(opts.blockTypes.indexOf('bottom') > -1);
    this.blockCheckboxes[3].update(opts.blockTypes.indexOf('color') > -1);
    this.opacitySlider.update((opts.opacity * 10) / 9 - 0.1);
    this.areaSlider.update(
      opts.area <= 0.25
        ? 0
        : opts.area <= 0.5
        ? 0.333
        : opts.area <= 0.75
        ? 0.666
        : 1
    );
    this.speedSlider.update(opts.speed - 0.5);
    this.fontSlider.update(opts.fontSize - 0.5);
    this.otherCheckboxes[0].update(opts.unlimited);
    this.otherCheckboxes[1].update(opts.bottomUp);
    this.otherCheckboxes[2].update(opts.merge);
  }

  private initPopover(): void {
    const first = this.newSettingItem('rplayer_dan_flex');
    const onOff = RPlayer.utils.newElement('rplayer_dan_onoff');
    const onOffLabel = this.newSettingLabel('弹幕');
    this.onOffSwitch = new RPlayer.Switch({
      onChange: this.onOnOffChange,
      small: true,
    });
    onOff.appendChild(onOffLabel);
    this.onOffSwitch.mount(onOff);
    const resetBtn = RPlayer.utils.newElement('rplayer_dan_setting_reset');
    resetBtn.innerText = '恢复默认设置';
    resetBtn.addEventListener('click', this.onResetClick);
    first.appendChild(onOff);
    first.appendChild(resetBtn);

    const block = this.newSettingItem();
    const blockLabel = this.newSettingLabel('按类型屏蔽', 'rplayer_dan_mbs');
    const blockAction = RPlayer.utils.newElement('rplayer_dan_setting_check');
    this.blockCheckboxes[0] = new RPlayer.Checkbox({
      label: '滚动',
      onChange: this.onBlockTypeChange('scroll'),
    });
    this.blockCheckboxes[1] = new RPlayer.Checkbox({
      label: '顶部',
      onChange: this.onBlockTypeChange('top'),
    });
    this.blockCheckboxes[2] = new RPlayer.Checkbox({
      label: '底部',
      onChange: this.onBlockTypeChange('bottom'),
    });
    this.blockCheckboxes[3] = new RPlayer.Checkbox({
      label: '彩色',
      onChange: this.onBlockTypeChange('color'),
    });
    this.blockCheckboxes.forEach((c) => c.mount(blockAction));
    block.appendChild(blockLabel);
    block.appendChild(blockAction);

    this.opacitySlider = new RPlayer.Slider({
      map(v): string {
        return Math.round(((v * 9) / 10) * 100 + 10) + '%';
      },
      onChange: this.onOpacityChange,
    });
    const opacity = this.newSliderItem('不透明度', this.opacitySlider);

    this.areaSlider = new RPlayer.Slider({
      stops: [
        { value: 0, label: '1/4' },
        { value: 0.333, label: '半屏' },
        { value: 0.666, label: '3/4' },
        { value: 1, label: '全屏' },
      ],
      stop: true,
      onChange: this.onAreaChange,
    });
    const area = this.newSliderItem('显示区域', this.areaSlider);

    this.speedSlider = new RPlayer.Slider({
      stops: [
        { value: 0, label: '慢' },
        { value: 1, label: '快' },
      ],
      map(v): string {
        return Math.round((v + 0.5) * 100) + '%';
      },
      onChange: this.onSpeedChange,
    });
    const speed = this.newSliderItem('弹幕速度', this.speedSlider);

    this.fontSlider = new RPlayer.Slider({
      stops: [
        { value: 0, label: '小' },
        { value: 1, label: '大' },
      ],
      map(v): string {
        return Math.round((v + 0.5) * 100) + '%';
      },
      onChange: this.onFontChange,
    });
    const font = this.newSliderItem('字体大小', this.fontSlider);

    const other = this.newSettingItem('rplayer_dan_setting_check');
    this.otherCheckboxes[0] = new RPlayer.Checkbox({
      label: '不限弹幕',
      onChange: this.onUnlimitedChange,
    });
    this.otherCheckboxes[1] = new RPlayer.Checkbox({
      label: '从下到上',
      onChange: this.onBottomUpChange,
    });
    this.otherCheckboxes[2] = new RPlayer.Checkbox({
      label: '合并重复',
      onChange: this.onMergeChange,
    });
    this.otherCheckboxes.forEach((c) => c.mount(other));

    this.popover.append(first);
    this.popover.append(block);
    this.popover.append(opacity);
    this.popover.append(area);
    this.popover.append(speed);
    this.popover.append(font);
    this.popover.append(other);
  }
}
