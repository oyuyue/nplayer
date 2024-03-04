import { PlayerBase } from './player-base';
import { I18n } from './features';
import { en } from './langs/en';
import { zh } from './langs/zh';
import {
  Play, Time, Speed, Airplay, Fullscreen, WebFullscreen, Quality, Volume, Spacer, Progress,
} from './control-items';

I18n.add('zh-cn', zh);
I18n.add('en', en);
PlayerBase.addControlItem(new Play());
PlayerBase.addControlItem(new Time());
PlayerBase.addControlItem(new Speed());
PlayerBase.addControlItem(new Airplay());
PlayerBase.addControlItem(new Fullscreen());
PlayerBase.addControlItem(new WebFullscreen());
PlayerBase.addControlItem(new Quality());
PlayerBase.addControlItem(new Volume());
PlayerBase.addControlItem(new Spacer());
PlayerBase.addControlItem(new Progress());

export class Player extends PlayerBase {

}
