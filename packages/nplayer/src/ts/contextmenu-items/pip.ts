import { I18n, PIP } from '../features';
import { ContextMenuItem } from '../parts/contextmenu';

export const pipContextMenuItem = (): ContextMenuItem => ({
  id: 'pip',
  html: I18n.t(PIP),
  init() {
    this.invisible = !('pictureInPictureEnabled' in document);
  },
  click(player) {
    if (player.video.readyState < 3) return;
    if ((document as any).pictureInPictureElement !== player.video) {
      (player.video as any).requestPictureInPicture();
    } else {
      (document as any).exitPictureInPicture();
    }
  },
});
