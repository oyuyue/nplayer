import type { HotkeyFn } from "./features/hotkey";
import type { Player } from "./player";


export type Source = string | MediaSource | ({ src?: string; srcset?: string; type?: string;})[]

export interface MediaInfo {
  src?: Source;
  title?: string;
  artist?: string;
  poster?: string;

  // duration?: number;
  // bg?: string;
  // live?: boolean;
  startTime?: number;

  hasPrev?: boolean;
  hasNext?: boolean;
}

export interface PlayerConfig<T extends HTMLMediaElement = HTMLMediaElement> extends MediaInfo {
  container?: HTMLElement;

  media?: T;

  getPrev?: () => MediaInfo | void;

  getNext?: () => MediaInfo | void;

  onSkipad?: () => void;

  hotkeys?: Record<string, HotkeyFn | { handler: HotkeyFn, global: boolean }> | false,

  autoplay?: boolean;

  seekStep?: number;

  volumeStep?: number;

  volume?: number;

  muted?: boolean;

  speed?: number;

  loop?: boolean;

  playsInline?: boolean;

  disablePIP?: boolean;

  disableRemotePlayback?: boolean;

  crossOrigin?: 'use-credentials' | 'anonymous' | ''

  preload?: 'none' | 'metadata' | 'auto' | '';
}

export function getConfig(config: PlayerConfig) {
  return Object.assign({
    seekStep: 5,
    volumeStep: 0.05,
    volume: 1,
    speed: 1,
    muted: false,
    loop: false,
    autoplay: false,
    playsInline: true,
    hotkeys: {
      ' ': ({ player }) => {
        player.toggle()
      },
      ArrowLeft: () => {

      },
      ArrowRight: () => {

      },
      ArrowUp: () => {

      },
      ArrowDown: () => {

      },
      Escape: ({ player }) => {
        player.exitWebFullscreen()
        player.exitFullscreen()
      }
    }
  } as PlayerConfig, config)
}
