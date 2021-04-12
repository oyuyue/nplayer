---
title: 事件
---

`player` 对象会触发一些事件，可以通过 `on`、`once` 方法进行监听，`emit` 方法用与触发自定义事件或已定义事件。

`RPlayer` 类上有 `EVENT` 属性，它上面定义了所有 `player` 会触发的事件名。比如 `RPlayer.EVENT.PLAY` 的值是 `play` 字符串，当视频播放时会触发该事件。

`EVENT` 对象属性与事件名对应关系是，事件名是 `EVENT` 属性的小写，并将 `_` 变成 `-`。如，`RATE_CHANGE` 等于 `rate-change`。

```js
import Player, { EVENT } from 'rplayer'

const player = Player()

player.on(EVENT.PLAY, () => {})
player.on('rate-change', () => {})
```

### 事件列表

| 事件名 | 描述 |
|  ---  | ---  |
| enter-fullscreen  | 进入全屏 |
| exit-fullscreen  | 退出全屏 |
| web-enter-fullscreen  | 进入网页全屏 |
| web-exit-fullscreen  | 退出网页全屏 |
| loading-show  | 视频 loading 显示 |
| loading-hide  | 视频 loading 隐藏 |
| control-show  | 控制条显示 |
| control-hide  | 控制条隐藏 |
| enter-pip  | 进入画中画 |
| exit-pip  | 退出画中画 |
| update-size  | 更新播放器尺寸，比如 window resize 会触发，当外部将播放器元素大小变化时，可以手动触发该事件，防止播放器组件错位 |
| update-options  | 更新配置 |
| mounted  | 播放器挂载 |
| before-dispose  | 播放器销毁前，当调用 `dispose` 方法触发 |
| open-edge  | 在 IE 中自动打开 edge 浏览器，访问该网页时触发 |
| play | 同 video play 事件 |
| pause  | 同 video pause 事件 |
| ended  | 同 video ended 事件 |
| waiting | 同 video waiting 事件 |
| stalled  | 同 video stalled 事件 |
| canplay  | 同 video canplay 事件 |
| loaded-metadata | 同 video loadedmetadata 事件 |
| error | 同 video error 事件 |
| seeked  | 同 video seeked 事件 |
| time-update  | 同 video timeupdate 事件 |
| volume-change  | 同 video volumechange 事件 |
| rate-change  | 同 video ratechange 事件 |
| duration-change  | 同 video durationchange 事件 |
| progress | 同 video progress 事件 |
