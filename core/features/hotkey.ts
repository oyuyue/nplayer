import type { Player } from '../player'

export class Hotkey {
  constructor(private player: Player) {
    const { hotkeys } = player.config
    if (!hotkeys) return;
  }

  private onKeyDown = () => {

  }

  enable() {
    this.player.el.addEventListener('keydown', this.onKeyDown)
    document.addEventListener('keydown', this.onKeyDown)
  }

  disable() {
    this.player.el.removeEventListener('keydown', this.onKeyDown)
    document.removeEventListener('keydown', this.onKeyDown)
  }
}

// 'key', handler, container
/**
 * {
 *  hotkeys: {
 *  'key': [() => {}, true], // only container
 *  'key': () => {},
 * }
 * }
 */
