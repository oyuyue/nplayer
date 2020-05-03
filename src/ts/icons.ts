import enterFullscreen from '../icons/enter-fullscreen.svg';
import exitFullscreen from '../icons/exit-fullscreen.svg';
import muted from '../icons/muted.svg';
import pause from '../icons/pause.svg';
import play from '../icons/play.svg';
import settings from '../icons/settings.svg';
import volume from '../icons/volume.svg';
import { strToDom } from './utils';

export default {
  play: strToDom(play),
  pause: strToDom(pause),
  enterFullscreen: strToDom(enterFullscreen),
  exitFullscreen: strToDom(exitFullscreen),
  volume: strToDom(volume),
  muted: strToDom(muted),
  settings: strToDom(settings),
};
