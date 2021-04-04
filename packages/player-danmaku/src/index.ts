import './scss/index.scss';
import { Danmaku } from './ts/danmaku';

export { DanmakuPlugin as default } from './ts/main';
export * from './ts/main';
export * from './ts/danmaku';

declare module 'player' {
  interface Player {
    danmaku: Danmaku;
  }
}
