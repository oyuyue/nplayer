---
title: 事件
---

`player` 对象会触发一些事件，可以通过 `on`、`once` 方法进行监听，`emit` 方法用与触发自定义事件或已定义事件。事件名都是大驼峰形式的字符串。

你可以使用 Player 类的 `EVENT` 静态属性或 player 实例的 `EVENT` 访问这些常量事件名字符串。

```js
import Player, { EVENT } from 'nplayer'

const player = new Player()
console.log(EVENT.LOADING_SHOW)
console.log(Player.EVENT.LOADING_SHOW)
console.log(player.EVENT.LOADING_SHOW)
console.log('LoadingShow')
// 都是相同的字符串

const noop = () => {}
player.on(EVENT.LOADING_SHOW, noop)
player.once(EVENT.LOADING_SHOW, noop)
player.off(EVENT.LOADING_SHOW, noop)
player.emit(EVENT.LOADING_SHOW)
```

### 事件列表

| 事件名 | 描述 |
|  ---  | ---  |
| EnterFullscreen  | 进入全屏 |
| ExitFullscreen  | 退出全屏 |
| WebEnterFullscreen  | 进入网页全屏 |
| WebExitFullscreen  | 退出网页全屏 |
| LoadingShow  | 视频 loading 显示 |
| LoadingHide  | 视频 loading 隐藏 |
| ControlShow  | 控制条显示 |
| ControlHide  | 控制条隐藏 |
| ControlItemUpdate  | 更新控制条项目位置时触发，调用 `player.updateControlItems()` |
| EnterPip  | 进入画中画 |
| ExitPip  | 退出画中画 |
| UpdateSize  | 更新播放器尺寸，比如 window resize 会触发，当外部将播放器元素大小变化时，可以手动触发该事件，防止播放器组件错位 |
| UpdateOptions  | 更新配置 |
| AfterInit | 播放器初始化完成时触发 |
| Mounted  | 播放器挂载 |
| BeforeDispose  | 播放器销毁前，当调用 `dispose` 方法触发 |
| OpenEdge  | 在 IE 中自动打开 edge 浏览器，访问该网页时触发 |
| Play | 同 video play 事件 |
| Pause  | 同 video pause 事件 |
| Ended  | 同 video ended 事件 |
| Waiting | 同 video waiting 事件 |
| Stalled  | 同 video stalled 事件 |
| Canplay  | 同 video canplay 事件 |
| LoadedMetadata | 同 video loadedmetadata 事件 |
| Error | 同 video error 事件 |
| Seeked  | 同 video seeked 事件 |
| TimeUpdate  | 同 video timeupdate 事件 |
| VolumeChange  | 同 video volumechange 事件 |
| RateChange  | 同 video ratechange 事件 |
| DurationChange  | 同 video durationchange 事件 |
| Progress | 同 video progress 事件 |
| BpChange | 当播放器大小变换到特定断点时触发，`bpControls` 参数中设置的断点 |
