import { PlayerOptions } from './types';

const defaultOptions = (): Partial<PlayerOptions> => ({
  shortcut: true,
  seekStep: 10,
  volumeStep: 0.1,
  volumeBarWidth: 100,
  controls: ['play', 'time', 'progress', 'airplay', 'web-fullscreen', 'fullscreen'],
  topControls: ['spacer', 'settings'],
  settings: ['speed'],
  contextMenus: ['loop', 'pip', 'version'],
  contextMenuToggle: true,
  openEdgeInIE: true,
  posterEnable: true,
  videoAttrs: {
    crossorigin: 'anonymous',
    preload: 'auto',
    playsinline: 'true',
  },
});

export function processOptions(opts?: PlayerOptions): Required<PlayerOptions> {
  const dOpts = defaultOptions();
  return {
    ...dOpts,
    ...opts,
    videoAttrs: {
      ...dOpts.videoAttrs,
      ...opts?.videoAttrs,
    },
    isTouch: (('ontouchstart' in window)
    || (navigator.maxTouchPoints > 0)
    || (navigator.msMaxTouchPoints > 0)),
  } as Required<PlayerOptions>;
}
