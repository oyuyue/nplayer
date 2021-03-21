import { ContextMenuItem } from '../parts/contextmenu';

export const PipContextMenuItem: ContextMenuItem = {
  id: 'pip',
  html: '画中画',
  init() {
    if (!('requestPictureInPicture' in HTMLVideoElement)) {
      this.invisible = true;
    }
  },
  click(_, player) {
    if ((document as any).pictureInPictureElement !== player.video) {
      (player.video as any).requestPictureInPicture();
    } else {
      (document as any).exitPictureInPicture();
    }
  },
};
