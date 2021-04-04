export const CLASS_PREFIX = 'rplayer_';

export const CLASS_PLAYER = 'rplayer';

export const EVENT = {
  ENTER_FULLSCREEN: 'enter-fullscreen',
  EXIT_FULLSCREEN: 'exit-fullscreen',
  WEB_ENTER_FULLSCREEN: 'web-enter-fullscreen',
  WEB_EXIT_FULLSCREEN: 'web-exit-fullscreen',
  DURATION_CHANGE: 'duration-change',
  RATE_CHANGE: 'rate-change',
  PLAY: 'play',
  PAUSE: 'pause',
  ENDED: 'ended',
  WAITING: 'waiting',
  STALLED: 'stalled',
  CANPLAY: 'canplay',
  LOADED_METADATA: 'loaded-metadata',
  ERROR: 'error',
  SEEKED: 'seeked',
  TIME_UPDATE: 'time-update',
  VOLUME_CHANGE: 'volume-change',
  PROGRESS: 'progress',
  ENTER_PIP: 'enter-pip',
  EXIT_PIP: 'exit-pip',
  LOADING_SHOW: 'loading-show',
  LOADING_HIDE: 'loading-hide',
  MOUNTED: 'mounted',
  UPDATE_SIZE: 'update-size',
  BEFORE_DISPOSE: 'before-dispose',
  UPDATE_OPTIONS: 'update-options',
  OPEN_EDGE: 'open-edge',
} as const;
