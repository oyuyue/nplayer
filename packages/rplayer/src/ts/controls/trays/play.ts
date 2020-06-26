import { PAUSE, PLAY } from '../../config/lang';
import Events from '../../events';
import icons from '../../icons';
import RPlayer from '../../rplayer';
import Tray from '../../widgets/tray';
import EventHandler from '../../event-handler';

export default class PlayTray extends EventHandler {
  private readonly tray: Tray;
  readonly pos = 0;

  constructor(player: RPlayer) {
    super(player, [Events.PLAY, Events.PAUSE]);
    this.tray = new Tray({
      label: player.t(PLAY),
      labelPos: 'left',
      icons: [icons.play(), icons.pause()],
      onClick: this.onClick,
    });
  }

  get dom(): HTMLElement {
    return this.tray.dom;
  }

  onClick = (): void => {
    this.player.toggle();
  };

  onPlay(): void {
    this.tray.changeTip(this.player.t(PAUSE));
    this.tray.showIcon(1);
  }

  onPause(): void {
    this.tray.changeTip(this.player.t(PLAY));
    this.tray.showIcon(0);
  }
}
