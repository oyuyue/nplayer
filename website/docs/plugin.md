---
title: 插件
---

NPlayer 可以通过插件来扩充它的功能，编写一个插件也非常的简单。

NPlayer 的插件是一个对象，它的接口定义如下。

```tyescript
interface Plugin {
  apply: (player: Player) => void;
  dispose?: () => void;
}
```

插件其实就是一个接收 `player` 对象的一个函数。其中 `dispose` 可选的卸载方法，当播放器卸载时会调用该方法。

### 例子

我们可以实现一个 `log` 插在，在 `player` 触发事件时打印日志。

```js
new Player({
  plugins: [
    {
      apply(player) {
        player.on('mounted', () => console.log('mounted'))
        player.on('play', () => console.log('play'))
        // ...
      }
    }
  ]
})
```

Player 接收一个 `plugins` 参数，它是应用在当前播放器的插件。

### 弹幕插件

如果你想给播放器添加弹幕功能，可以直接引入 NPlayer 的弹幕插件。

```js
import Player from 'nplayer'
import Danmaku from '@nplayer/danmaku'

new Player(plugins: [new Danmaku()])
```

更多插件详情可以查看弹幕插件章节。
