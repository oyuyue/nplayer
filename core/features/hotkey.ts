import type { Player } from '../player'
import { isFunction } from '../utils';

export type HotkeyFn = (info: {
  player: Player,
  global: boolean,
  ev: KeyboardEvent,
  el: HTMLElement | Document,
  onKeyupOnce: (fn: () => void) => void
}) => (boolean | void)

interface HotKeyInfo {
  ctrl: boolean;
  shift: boolean;
  alt: boolean;
  meta: boolean;
  global: boolean;
  handler: HotkeyFn
}

const editableTagNames = ['input', 'textarea', 'select'];

export class Hotkey {

  private map?: Record<string, HotKeyInfo>;

  private onKeyDown: (ev: KeyboardEvent) => void;
  private onKeyDownGlobal: (ev: KeyboardEvent) => void;

  constructor(private player: Player) {
    this.onKeyDown = this.createListener(false, this.player.el);
    this.onKeyDownGlobal = this.createListener(true, document)

    this.parseConfig()
    if (this.map) {
      this.enable()
    }
  }

  private createListener = (
    global: boolean,
    el: HTMLElement | Document
  ) =>  (ev: KeyboardEvent) => {
    if (!this.map) return
    const item = this.map[ev.key.toLowerCase()]
    if (!item || item.global !== global) return;
    if (
      ev.ctrlKey === item.ctrl &&
      ev.altKey === item.alt &&
      ev.metaKey === item.meta &&
      ev.shiftKey === item.shift
    ) {
      const focused = document.activeElement;
      if (
        focused && (
          editableTagNames.indexOf(focused.tagName.toLowerCase()) > -1 ||
          focused.getAttribute('contenteditable') != null
        )
      ) {
        return;
      }

      const handled = item.handler({
        player: this.player,
        el,
        ev,
        global,
        onKeyupOnce: (fn) => {
          const cb = () => {
            el.removeEventListener('keyup', cb)
            fn()
          }
          el.addEventListener('keyup', cb)
        },
      })
      if (handled) {
        ev.preventDefault()
        ev.stopImmediatePropagation()
      }
    }
  }

  private parseConfig() {
    const { hotkeys } = this.player.config    
    if (hotkeys) {
      const map: Record<string, HotKeyInfo> = {}
      Object.keys(hotkeys).forEach(k => {
        if (!k) return;
        const v = hotkeys[k];
        const isF = isFunction(v);
        let item: HotKeyInfo = {
          ctrl: false,
          alt: false,
          meta: false,
          shift: false,
          global: isF ? true : v.global,
          handler: isF ? v : v.handler,
        }
        let key = ''
        const keys = k.toLowerCase().split('+');
        keys.forEach(key => {
          if (key === 'ctrl') {
            item.ctrl = true;
          } else if (key === 'alt') {
            item.alt = true
          } else if (key === 'meta') {
            item.meta = true
          } else if (key === 'shift') {
            item.shift = true
          } else {
            key = key;
          }
        })
        map[key] = item;
      })
      this.map = map;
    } else {
      this.map = undefined;
    }
  }

  enable() {
    this.player.el.addEventListener('keydown', this.onKeyDown)
    document.addEventListener('keydown', this.onKeyDownGlobal)
  }

  disable() {
    this.player.el.removeEventListener('keydown', this.onKeyDown)
    document.removeEventListener('keydown', this.onKeyDownGlobal)
  }
}
