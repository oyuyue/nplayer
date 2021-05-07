import type {
  Player, Popover, Tooltip, Checkbox, Slider, ControlItem,
} from 'nplayer';
import {
  BIG, BLOCK_BT, BOTTOM, BOTTOM_TT, COLOUR, DANMAKU_S, DANMAKU_SETTINGS, DISPLAY_A, FAST, FONTSIZE,
  FULL_S, HALF_S, ONOFF, OPACITY, RESTORE, SCROLL, SLOW, SMALL, TOP, UNLIMITED,
} from './utils';

class DanmakuSetting implements ControlItem {
  readonly id = 'danmaku-setting';

  private player!: Player

  el!: HTMLElement;

  tooltip!: Tooltip;

  private popover!: Popover;

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

  init(player: Player) {
    this.player = player;
    const { __utils, components, I18n } = player.Player;
    const {
      $, clamp, addDisposableListener, addDisposable, createSvg,
    } = __utils;

    this.el = $();
    this.el.appendChild(createSvg('icon', 'M9 21v2H7v-2h2m4 0v2h-2v-2h2m4 0v2h-2v-2h2M2 19V3h20v16m-11-7H9v2h2v-2m8 0h-6v2h6v-2M7 8H5v2h2V8m12 0H9v2h10V8z'));
    this.tooltip = addDisposable(this, new components.Tooltip(this.el, I18n.t(DANMAKU_SETTINGS)));
    this.popover = addDisposable(this, new components.Popover(this.el, () => this.tooltip.show()));

    addDisposableListener(this, this.el, 'click', this.show);

    const panelElement = this.popover.panelElement;
    __utils.addClass(panelElement, 'danmaku_setting');

    player.on('Mounted', () => {
      const row = () => $('.flex.align-center.danmaku_row');

      let rowElement = row();
      rowElement.appendChild($('.danmaku_onoff_label', undefined, I18n.t(ONOFF)));
      addDisposable(this, new components.Switch(rowElement, player.danmaku.enabled, (v) => player.danmaku[v ? 'enable' : 'disable']()));
      const resetBtn = rowElement.appendChild($('.danmaku_reset', undefined, I18n.t(RESTORE)));
      addDisposableListener(this, resetBtn, 'click', () => {
        player.danmaku.resetOptions();
        this.update();
      });
      panelElement.appendChild(rowElement);
      rowElement = $('.danmaku_row');
      panelElement.appendChild(rowElement);
      rowElement.appendChild($(undefined, undefined, I18n.t(BLOCK_BT)));
      rowElement = rowElement.appendChild($('.flex.align-center'));
      this.scrollCB = addDisposable(this, new components.Checkbox(rowElement, {
        html: I18n.t(SCROLL),
        change(v) {
          player.danmaku[v ? 'blockType' : 'allowType']('scroll');
        },
      }));
      this.topCB = addDisposable(this, new components.Checkbox(rowElement, {
        html: I18n.t(TOP),
        change(v) {
          player.danmaku[v ? 'blockType' : 'allowType']('top');
        },
      }));
      this.bottomCB = addDisposable(this, new components.Checkbox(rowElement, {
        html: I18n.t(BOTTOM),
        change(v) {
          player.danmaku[v ? 'blockType' : 'allowType']('bottom');
        },
      }));
      this.colorCB = addDisposable(this, new components.Checkbox(rowElement, {
        html: I18n.t(COLOUR),
        change(v) {
          player.danmaku[v ? 'blockType' : 'allowType']('color');
        },
      }));
      rowElement = row();
      rowElement.appendChild($(undefined, undefined, I18n.t(OPACITY)));
      this.opacitySlider = addDisposable(this, new components.Slider(rowElement, {
        stops: [{ value: 0, html: '10%' }, { value: 1, html: '100%' }],
        change(value) {
          player.danmaku.updateOpacity(clamp(value + 0.1, 0.1, 1));
        },
      }, player));
      panelElement.appendChild(rowElement);
      rowElement = row();
      rowElement.appendChild($(undefined, undefined, I18n.t(DISPLAY_A)));
      this.areaSlider = addDisposable(this, new components.Slider(rowElement, {
        stops: [{ value: 0, html: '1/4' }, { value: 0.33, html: I18n.t(HALF_S) }, { value: 0.66, html: '3/4' }, { value: 1, html: I18n.t(FULL_S) }],
        step: true,
        change(v) {
          v = v === 0 ? 0.25 : v === 0.33 ? 0.5 : v === 0.66 ? 0.75 : 1;
          player.danmaku.updateArea(v as any);
        },
      }, player));
      panelElement.appendChild(rowElement);
      rowElement = row();
      rowElement.appendChild($(undefined, undefined, I18n.t(DANMAKU_S)));
      this.speedSlider = addDisposable(this, new components.Slider(rowElement, {
        stops: [{ value: 0, html: I18n.t(SLOW) }, { value: 1, html: I18n.t(FAST) }],
        change(v) {
          player.danmaku.updateSpeed(clamp(v + 0.5, 0.5, 1.5));
        },
      }, player));
      panelElement.appendChild(rowElement);
      rowElement = row();
      rowElement.appendChild($(undefined, undefined, I18n.t(FONTSIZE)));
      this.fontsizeSlider = addDisposable(this, new components.Slider(rowElement, {
        stops: [{ value: 0, html: I18n.t(SMALL) }, { value: 1, html: I18n.t(BIG) }],
        change(v) {
          player.danmaku.updateFontsize(clamp(v + 0.5, 0.5, 1.5));
        },
      }, player));
      panelElement.appendChild(rowElement);
      rowElement = row();
      this.unlimitedCB = addDisposable(this, new components.Checkbox(rowElement, {
        html: I18n.t(UNLIMITED), change(v) { player.danmaku.updateUnlimited(v); },
      }));
      this.bottomUpCB = addDisposable(this, new components.Checkbox(rowElement, {
        html: I18n.t(BOTTOM_TT), change(v) { player.danmaku.updateBottomUp(v); },
      }));
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
    this.tooltip.hide();
  }

  dispose() {
    if (!this.player) return;
    this.player.Player.__utils.dispose(this);
    this.player.Player.__utils.removeNode(this.el);
    this.player = null!;
  }
}

export const danmakuSettingControlItem = () => new DanmakuSetting();
