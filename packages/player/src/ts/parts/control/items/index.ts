import { Spacer } from 'src/ts/components/spacer';
import { Player } from 'src/ts/player';
import { Component } from 'src/ts/utils';
import { FullscreenControlItem } from './fullscreen';
import { PlayControlItem } from './play';
import { SettingControlItem } from './setting';
import { TimeControlItem } from './time';
import { VolumeControlItem } from './volume';
import { WebFullscreenControlItem } from './web-fullscreen';

export class ControlBar extends Component {
  constructor(container: HTMLElement, player: Player) {
    super(container, '.control_bar');
    new PlayControlItem(this.element, player);
    new VolumeControlItem(this.element, player);
    new TimeControlItem(this.element);
    new Spacer(this.element);
    new SettingControlItem(this.element, [{ type: 'switch', html: '自动播放' }, { type: 'switch', html: '自动播放自动播放自动播放' }, { html: '播放速率', value: 1, options: [{ html: '2.0x', value: 2 }, { html: '1.0x', value: 1 }, { html: '0.5x', value: 0.5 }] }]);
    new WebFullscreenControlItem(this.element, player);
    new FullscreenControlItem(this.element, player);
  }
}
