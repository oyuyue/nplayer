import { PlayerOptions } from './types';

const defaultOptions = (): Partial<PlayerOptions> => ({
  shortcut: true,
  seekStep: 10,
  volumeStep: 0.1,
  volumeBarLength: 100,
  settings: ['speed'],
  contextMenus: ['loop', 'pip', 'version'],
  contextMenuToggle: true,
  openEdgeInIE: true,
  posterEnable: true,
  videoProps: {
    preload: 'auto',
    playsinline: 'true',
  },
});

export function processOptions(opts?: PlayerOptions): Required<PlayerOptions> {
  const dOpts = defaultOptions();
  const res = {
    ...dOpts,
    isTouch: (('ontouchstart' in window)
    || (navigator.maxTouchPoints > 0)
    || ((navigator as any).msMaxTouchPoints > 0)),
    ...opts,
  } as Required<PlayerOptions>;

  res.controls = res.controls || [
    ['play', res.isTouch ? '' : 'volume', 'time', 'spacer', 'airplay', 'settings', 'web-fullscreen', 'fullscreen'],
    [res.live ? '' : 'progress'],
  ];

  res.bpControls = res.bpControls || {
    650: [
      ['play', res.live ? '' : 'progress', 'time', 'web-fullscreen', 'fullscreen'],
      [],
      ['spacer', 'airplay', 'settings'],
    ],
  };

  res.controls = res.controls.filter(Boolean).map((x) => x.filter(Boolean));

  const newBpControls: PlayerOptions['bpControls'] = {};
  // eslint-disable-next-line no-restricted-globals
  Object.keys(res.bpControls).filter((x) => x && !isNaN(Number(x)) && Array.isArray(res.bpControls[x])).forEach((k) => {
    newBpControls[k] = res.bpControls[k].filter(Boolean).map((x) => x.filter(Boolean));
  });

  res.bpControls = newBpControls;

  return res;
}
