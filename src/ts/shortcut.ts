import RPlayer from './rplayer';
import { isNum, makeDictionary } from './utils';

export type ShortcutHandler = (player: RPlayer) => any;

class Shortcut {
  private readonly player: RPlayer;
  private readonly handler: { [key: number]: ShortcutHandler };

  readonly editable = ['input', 'textarea', 'select'];

  constructor(player: RPlayer) {
    this.player = player;
    const opts = player.options.shortcut;

    this.handler = makeDictionary({
      38: (p): void => p.incVolume(opts.volume), // 🠝
      40: (p): void => p.decVolume(opts.volume), // 🠟
      39: (p): void => p.forward(opts.time), // 🠞
      37: (p): void => p.rewind(opts.time), // 🠜
      32: (p): void => p.toggle(), // space
    });

    if (opts.enable) {
      this.enable(opts.global);
    }
  }

  private keydownHandler = (ev: KeyboardEvent): void => {
    if (ev.altKey || ev.ctrlKey || ev.metaKey || ev.shiftKey) return;
    const focused = document.activeElement;

    if (focused) {
      const tag = focused.tagName.toLowerCase();
      const editable = focused.getAttribute('contenteditable');
      if (this.editable.indexOf(tag) > -1 || editable || editable === '') {
        return;
      }
    }

    const code = ev.keyCode ? ev.keyCode : ev.which;

    if (!isNum(code)) return;

    let handled = false;
    if (this.handler[code]) {
      this.handler[code](this.player);
      handled = true;
      this.player.controls.showTemporary();
    }

    if (handled) {
      ev.preventDefault();
      ev.stopPropagation();
    }
  };

  register(code: number, fn: ShortcutHandler): void {
    this.handler[code] = fn;
  }

  unregister(code: number): void {
    delete this.handler[code];
  }

  enable(global = false): void {
    const dom = global ? document : this.player.dom;
    dom.addEventListener('keydown', this.keydownHandler);
  }

  disable(global = false): void {
    const dom = global ? document : this.player.dom;
    dom.removeEventListener('keydown', this.keydownHandler);
  }
}

export default Shortcut;
