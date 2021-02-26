import EventEmitter from 'eventemitter3';
import { PlayerOptions } from './types';
import { processOptions } from './options';
import {
  $, addClass, getEl,
} from './utils';
import { Control } from './parts/control';
import { Loading } from './parts/loading';
import { ContextMenu } from './parts/contextmenu';
import { Toast } from './parts/toast';
import { Dialog } from './parts/dialog';

export class Player extends EventEmitter {
  private el: HTMLElement | null;

  readonly element: HTMLElement;

  readonly video: HTMLVideoElement;

  private opts: PlayerOptions;

  readonly control: Control;

  readonly contextmenu: ContextMenu;

  readonly toast: Toast;

  readonly dialog: Dialog;

  constructor(opts: PlayerOptions) {
    super();
    this.opts = processOptions(opts);
    this.el = getEl(this.opts.el);
    this.element = $('.rplayer', undefined, undefined, '');
    if (this.opts.video) {
      this.video = this.opts.video;
      addClass(this.video, 'video');
    } else {
      this.video = $('video.video', { src: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4' });
    }

    this.element.appendChild(this.video);
    this.control = new Control(this.element);
    new Loading(this.element);
    this.contextmenu = new ContextMenu(this.element, this, [{ html: 'asdasd' }]);
    this.toast = new Toast(this.element);
    this.dialog = new Dialog();
  }

  mount(el?: PlayerOptions['el']): void {
    if (el) this.el = getEl(el) || this.el;
    if (!this.el) throw new Error('require `el` option');
    this.el.appendChild(this.element);
  }
}
