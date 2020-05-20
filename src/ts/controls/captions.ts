import { CAPTIONS, CLOSE } from '../config/lang';
import icons from '../icons';
import RPlayer from '../rplayer';
import { ajax, newElement, ua } from '../utils';
import Radio, { RadioChangeFn } from './setting-menu/radio';
import Tray from './tray';

class CaptionAction extends Tray {
  private readonly captions: Captions;
  private readonly activeClass = 'rplayer_action_cap-active';

  constructor(player: RPlayer, captions: Captions) {
    super(player);
    this.captions = captions;

    this.addClass('rplayer_action_cap');
    this.changeTipText(player.t(CAPTIONS));
    this.appendChild(icons.cc());
  }

  onClick(): void {
    this.captions.toggle();
  }

  active(): void {
    this.addClass(this.activeClass);
  }

  deactivate(): void {
    this.removeClass(this.activeClass);
  }
}

interface CaptionItem {
  label?: string;
  index: number;
  track?: TextTrack;
  show?: boolean;
}

export interface CaptionsOpts {
  style?: Partial<CSSStyleDeclaration>;
  checked?: number;
  captions: HTMLTrackElement[];
}

export default class Captions {
  private readonly player: RPlayer;
  private tray: CaptionAction;
  private items: CaptionItem[];
  private prev: CaptionItem = {} as CaptionItem;
  private radio: Radio;
  private readonly dom: HTMLElement;
  private readonly activeClass = 'rplayer_caption-active';

  constructor(player: RPlayer) {
    this.player = player;
    const { captions, checked, style } = player.options.captions;
    if (captions && captions.length) {
      this.dom = newElement('div', 'rplayer_caption');
      player.appendChild(this.dom);

      this.update(captions, checked);
      if (style) this.updateUI(style);
    }
  }

  private optionChangeHandler: RadioChangeFn = (item, update): void => {
    if (this.prev.track) {
      this.prev.show = false;
      this.removeCueEvent();
    }

    if (item.track) {
      this.addCueEvent(item.track);
      this.tray.active();
      this.prev = item as any;
      this.show();
    } else {
      this.hide();
      this.tray.deactivate();
    }

    update();
  };

  private cueChangeHandler = (ev: Event): void => {
    const cues: VTTCue[] = [...((ev.target as any).activeCues || [])];
    if (cues) {
      cues.forEach((cue) => {
        this.renderText(cue.getCueAsHTML().firstChild.textContent);
      });
    }
  };

  private addCueEvent(track = this.prev.track): void {
    this.cueChangeHandler({ target: track } as any);
    track.addEventListener('cuechange', this.cueChangeHandler);
  }

  private removeCueEvent(): void {
    this.prev.track.removeEventListener('cuechange', this.cueChangeHandler);
    this.renderText('');
  }

  private run(): void {
    const tracks = this.player.media.textTracks;
    if (!tracks || !tracks.length) return;

    this.items.push({
      label: this.player.t(CLOSE),
      index: 0,
    });
    for (let i = 0, l = tracks.length; i < l; i++) {
      const track = tracks[i];
      track.mode = 'hidden';
      this.items.push({ track, index: i + 1, label: track.label, show: false });
    }

    this.radio = this.player.addSettingItem({
      label: this.player.t(CAPTIONS),
      items: this.items as any,
      onChange: this.optionChangeHandler,
    }) as Radio;

    this.tray = new CaptionAction(this.player, this);
    this.player.controls.bottom.actions.addAction(this.tray, 3);

    if (this.prev.index) {
      this.toggle();
    }
  }

  renderText(text: string): void {
    this.dom.innerHTML = text;
  }

  show(): void {
    this.dom.classList.add(this.activeClass);
    this.prev.show = true;
  }

  hide(): void {
    this.dom.classList.remove(this.activeClass);
    this.prev.show = false;
  }

  update(tracks: Partial<HTMLTrackElement>[], checked = -1): void {
    if (!tracks || !tracks.length) return;
    this.items = [];
    const trackEls: HTMLTrackElement[] = [];

    const df = document.createDocumentFragment();
    tracks.forEach((item: HTMLTrackElement) => {
      const track = document.createElement('track');
      track.setAttribute('kind', 'captions');
      Object.keys(item).forEach((key) => {
        track.setAttribute(key, (item as any)[key]);
      });
      df.appendChild(track);
      trackEls.push(track);
    });

    if (ua.isIE) {
      let latch = 0;
      trackEls.forEach((track) => {
        const src = track.getAttribute('src');
        ajax(src, (_, data) => {
          if (data) {
            track.setAttribute(
              'src',
              URL.createObjectURL(new Blob([data], { type: 'text/vtt' }))
            );
          }
          latch++;
          if (latch == trackEls.length) this.run();
        });
      });
    }

    this.player.media.appendChild(df);
    this.prev = { index: checked + 1 };
    if (!ua.isIE) this.run();
  }

  updateUI(style: CaptionsOpts['style']): void {
    Object.keys(style).forEach((k) => {
      this.dom.style[k as any] = style[k as any];
    });
  }

  toggle(): void {
    if (this.prev.track && this.prev.show) {
      this.radio.select(0);
      this.tray.deactivate();
      this.hide();
      this.removeCueEvent();
    } else {
      this.prev = this.items[this.prev.index];

      if (!this.prev.track) {
        this.prev = this.items[1];
      }

      this.addCueEvent();
      this.radio.select(this.prev.index);
      this.tray.active();
      this.show();
    }
  }
}
