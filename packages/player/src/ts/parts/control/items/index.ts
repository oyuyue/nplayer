import { Spacer } from 'src/ts/components/spacer';
import { Component } from 'src/ts/utils';
import { FullscreenControlItem } from './fullscreen';
import { PlayControlItem } from './play';
import { SettingControlItem } from './setting';
import { TimeControlItem } from './time';
import { VolumeControlItem } from './volume';
import { WebFullscreenControlItem } from './webFullscreen';

export class ControlBar extends Component {
  constructor(container: HTMLElement) {
    super(container, '.control_bar');
    new PlayControlItem(this.element);
    new VolumeControlItem(this.element);
    new TimeControlItem(this.element);
    new Spacer(this.element);
    new SettingControlItem(this.element);
    new WebFullscreenControlItem(this.element);
    new FullscreenControlItem(this.element);
  }
}
