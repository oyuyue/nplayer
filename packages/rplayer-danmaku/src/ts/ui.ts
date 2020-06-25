import Danmaku from '.';
import RPlayer from 'rplayer';

export default class UI {
  private readonly danmaku: Danmaku;
  private readonly dom: HTMLElement;

  constructor(danmaku: Danmaku) {
    this.danmaku = danmaku;
    this.dom = RPlayer.utils.newElement();
  }

  render(): void {}
}
