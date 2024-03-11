import type { Player } from "./player";

type HotkeyFn = (player: Player, global: boolean) => (boolean | void)

export interface PlayerConfig {
  hotkeys?: Record<string, HotkeyFn | { handler: HotkeyFn, global: boolean }> | false,
}
