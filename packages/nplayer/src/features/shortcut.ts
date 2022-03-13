import { Player } from '../player';
import { Disposable } from '../types';
import { addDisposableListener, dispose, isNumber } from '../utils';
import { VOLUME, I18n } from './i18n';

export type ShortcutHandler = (player: Player) => void;

const editableTagNames = ['input', 'textarea', 'select'];

export class Shortcut implements Disposable {
  private map: Record<string, ShortcutHandler>;

  constructor(private player: Player, enable: boolean) {
    this.map = Object.create(null);

    const showVolume = (p: Player) => p.toast.show(`${I18n.t(VOLUME)} ${Math.round(p.volume * 100)}%`, 'left-bottom', 500);

    this.register(27, (p) => {
      if (!p.fullscreen.exit()) p.webFullscreen.exit();
    });
    this.register(32, (p) => p.toggle());
    this.register(37, (p) => {
      p.rewind();
      p.toast.show(`- ${p.opts.seekStep}s`, 'left-bottom', 500);
    });
    this.register(38, (p) => {
      p.incVolume();
      showVolume(p);
    });
    this.register(39, (p) => {
      p.forward();
      p.toast.show(`+ ${p.opts.seekStep}s`, 'left-bottom', 500);
    });
    this.register(40, (p) => {
      p.decVolume();
      showVolume(p);
    });

    if (enable) this.enable();
  }

  private onKeyDown = (ev: KeyboardEvent) => {
    if (ev.altKey || ev.ctrlKey || ev.metaKey || ev.shiftKey) return;
    const focused = document.activeElement;

    if (focused) {
      const tag = focused.tagName.toLowerCase();
      const editable = focused.getAttribute('contenteditable');
      if (editableTagNames.indexOf(tag) > -1 || editable || editable === '') {
        return;
      }
    }

    const code = ev.keyCode ? ev.keyCode : ev.which;

    if (!isNumber(code)) return;

    let handled = false;
    if (this.map[code]) {
      this.map[code](this.player);
      handled = true;
      this.player.control.showTransient();
    }

    if (handled) {
      ev.preventDefault();
      ev.stopPropagation();
    }
  }

  register(keyCode: number, handler: ShortcutHandler): void {
    this.map[keyCode] = handler;
  }

  unregister(keyCode: number): boolean {
    return delete this.map[keyCode];
  }

  dispose(): void {
    if (!this.map) return;
    dispose(this);
    this.map = null!;
  }

  enable(): void {
    this.disable();
    addDisposableListener(this, this.player.el, 'keydown', this.onKeyDown);
  }

  disable(): void {
    dispose(this);
  }
}
