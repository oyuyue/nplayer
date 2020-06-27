import Danmaku from '.';
import RPlayer from 'rplayer';
import dan from '../icons/dan.svg';
import Slider from 'rplayer/dist/widgets/slider';
import Switch from 'rplayer/dist/widgets/switch';
import Checkbox from 'rplayer/dist/widgets/checkbox';

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

  constructor(danmaku: Danmaku) {
    this.danmaku = danmaku;
    this.dom = RPlayer.utils.newElement();

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
  }

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
    if (v && !types.includes(type as any)) {
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

  render(): void {}

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
    this.blockCheckboxes[0].update(opts.blockTypes.includes('scroll'));
    this.blockCheckboxes[1].update(opts.blockTypes.includes('top'));
    this.blockCheckboxes[2].update(opts.blockTypes.includes('bottom'));
    this.blockCheckboxes[3].update(opts.blockTypes.includes('color'));
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
