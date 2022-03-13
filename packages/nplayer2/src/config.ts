import { PlayerConfig } from './types';

export function getPlayerConfig<M extends HTMLMediaElement>(config: PlayerConfig<M>): Required<PlayerConfig<M>> {
  const media = config?.media || document.createElement('video');

  return {
    media,
    control: {
      items: [['play', 'volume', 'time', 'spacer', 'speed', 'airplay', 'fullscreen', 'web-fullscreen']],
      bpItems: {
        650: [
          ['play', 'time', 'fullscreen'],
        ],
      },
    },
    contextmenu: {},
    loading: {},
    plugins: [],
    addMediaToDom: true,
    ...config,
  } as Required<PlayerConfig<M>>;
}
