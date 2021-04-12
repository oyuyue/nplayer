import './scss/index.scss';
import { Danmaku } from './ts/danmaku';

export { Plugin as default } from './ts/main';
export * from './ts/main';
export * from './ts/danmaku';

declare module 'nplayer' {
  interface Player {
    danmaku: Danmaku;
  }
}
