import { BP } from './config';
import Events from './events';
import RPlayer from './rplayer';

class Responsive {
  private readonly player: RPlayer;
  private resizePending = false;

  constructor(player: RPlayer) {
    this.player = player;

    Object.keys(BP).forEach((k) => {
      const mq = window.matchMedia(BP[k]);
      this.mqHandler(mq);
      mq.addListener(this.mqHandler);
    });

    window.addEventListener('resize', () => {
      if (this.resizePending) return;
      this.resizePending = true;
      requestAnimationFrame(this.resizeHandler);
    });
  }

  private mqHandler = ({
    media,
    matches,
  }: MediaQueryListEvent | MediaQueryList): void => {
    if (!matches) return;
    this.player.curBreakPoint = media;
    this.player.emit(Events.BREAK_POINT_CHANGE, media);
  };

  private resizeHandler = (): void => {
    this.player.emit(Events.RESIZE);
    this.resizePending = false;
  };
}

export default Responsive;
