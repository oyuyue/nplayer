import { PlayerConfig } from './types';

export function getPlayerConfig<M extends HTMLMediaElement>(config: PlayerConfig<M>): Required<PlayerConfig<M>> {
  const media = config?.media || document.createElement('video');

  return {
    media,
    volumeStep: 10,
    seekStep: 10,
    control: {
      items: [
        ['play'],
        ['setting'],
      ],
      // bpItems: {
      //   650: [
      //     ['play', 'time', 'fullscreen'],
      //   ],
      //   350: [
      //     ['play'],
      //   ],
      // },
    },
    contextmenu: {},
    loading: {},
    plugins: [],
    addMediaToDom: true,
    ...config,
  } as Required<PlayerConfig<M>>;
}
