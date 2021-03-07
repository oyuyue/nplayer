import { ContextMenuItem } from '../parts/contextmenu';

export const PipContextMenuItem: ContextMenuItem = {
  id: 'pip',
  html: '画中画',
  init() {
    if (!(document as any).pictureInPictureEnabled) {
      this.invisible = true;
    }
  },
  click(_, player) {
    if ((document as any).pictureInPictureElement) {
      (player.video as any).exitPictureInPicture();
    } else {
      (player.video as any).requestPictureInPicture();
    }
  },
};
