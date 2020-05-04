import enterFullscreen from '../icons/enter-fullscreen.svg';
import exitFullscreen from '../icons/exit-fullscreen.svg';
import muted from '../icons/muted.svg';
import pause from '../icons/pause.svg';
import play from '../icons/play.svg';
import settings from '../icons/settings.svg';
import volume from '../icons/volume.svg';
import { svgToDom } from './utils';

export default {
  play: svgToDom(play, 'rplayer_icon_play'),
  pause: svgToDom(pause, 'rplayer_icon_pause'),
  enterFullscreen: svgToDom(enterFullscreen, 'rplayer_icon_enter_fullscreen'),
  exitFullscreen: svgToDom(exitFullscreen, 'rplayer_icon_exit_fullscreen'),
  volume: svgToDom(volume, 'rplayer_icon_volume'),
  muted: svgToDom(muted, 'rplayer_icon_muted'),
  settings: svgToDom(settings),
};
