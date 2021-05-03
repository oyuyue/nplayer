import { PlayerOptions } from './types';

const defaultOptions = (): Partial<PlayerOptions> => ({
  shortcut: true,
  seekStep: 10,
  volumeStep: 0.1,
  volumeBarWidth: 100,
  controls: ['play', 'time', 'progress', 'airplay', 'web-fullscreen'],
  topControls: ['spacer', 'fullscreen', 'settings'],
  settings: ['speed'],
  contextMenus: ['loop', 'pip', 'version'],
  contextMenuToggle: true,
  openEdgeInIE: true,
  posterEnable: true,
  clickPause: true,
  dblclickFullscreen: true,
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
  } as Required<PlayerOptions>;
}
