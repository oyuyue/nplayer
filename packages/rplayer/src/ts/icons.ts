import cc from '../icons/cc.svg';
import enterFullscreen from '../icons/enter-fullscreen.svg';
import exitFullscreen from '../icons/exit-fullscreen.svg';
import muted from '../icons/muted.svg';
import pause from '../icons/pause.svg';
import play from '../icons/play.svg';
import settings from '../icons/settings.svg';
import volume from '../icons/volume.svg';
import { svgToDom } from './utils';

export default {
  play(cls?: string): Element {
    return svgToDom(play, cls);
  },
  pause(cls?: string): Element {
    return svgToDom(pause, cls);
  },
  enterFullscreen(cls?: string): Element {
    return svgToDom(enterFullscreen, cls);
  },
  exitFullscreen(cls?: string): Element {
    return svgToDom(exitFullscreen, cls);
  },
  volume(cls?: string): Element {
    return svgToDom(volume, cls);
  },
  muted(cls?: string): Element {
    return svgToDom(muted, cls);
  },
  settings(cls?: string): Element {
    return svgToDom(settings, cls);
  },
  cc(cls?: string): Element {
    return svgToDom(cc, cls);
  },
};
