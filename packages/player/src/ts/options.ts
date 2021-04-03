import { PlayerOptions } from './types';

const defaultOptions: Partial<PlayerOptions> = {
  shortcut: true,
  seekStep: 10,
  volumeStep: 0.1,
  themeColor: '#448AFF',
  progressBarColor: '#448AFF',
  volumeProgressBarColor: '#448AFF',
  controls: ['play', 'volume', 'time', 'spacer', 'airplay', 'settings', 'web-fullscreen', 'fullscreen'],
  settings: ['speed'],
  contextMenus: ['loop', 'pip', 'version'],
  contextMenuToggle: true,
};

export function processOptions(opts: PlayerOptions): Required<PlayerOptions> {
  return { ...defaultOptions, ...opts } as Required<PlayerOptions>;
}
