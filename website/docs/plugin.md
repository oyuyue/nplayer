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

## 例子

我们可以实现一个 `log` 插在，在 `player` 触发事件时打印日志。

```js
new Player({
  plugins: [
    {
      apply(player) {
        player.on('Mounted', () => console.log('mounted'))
        player.on('Play', () => console.log('play'))
        // ...
      }
    }
  ]
})
```

Player 接收一个 `plugins` 参数，它是应用在当前播放器的插件。

## 注册右键菜单、控制、设置项

你可以使用 `player` 上的这三个方法注册这些项。

- `registerSettingItem(item: SettingItem, id?: string): void` 注册设置项
- `registerContextMenuItem(item: ContextMenuItem, id?: string): void` 注册右键菜单项
- `registerControlItem(item: ControlItem, id?: string): void` 注册控制项

注册过后，用户就可以使用字符串配置播放器，而不是具体对象。

```js
const myPlugin = {
  apply(player) {
    player.registerControlItem({ id: 'my-control', element: document.createElement('input') })
  }
}

new Player({
  plugins: [myPlugin],
  controls: ['play', 'spacer', 'my-control']
})
```

我们通过 `registerControlItem` 注册一个控制项，然后在播放器的 `controls` 参数中就可以直接使用 `my-control` 字符串了。

对应右键菜单和设置项都是相同的使用方法。

## control 和 contextmenu

在执行插件 `apply` 的时候，`player` 对象的 `control` 和 `contextmenu` 都是 `undefined`。

```js
{
  apply(player) {
    console.log(player.control) // undefined
    console.log(player.contextmenu) // undefined
    
    player.on('AfterInit', () => {
      console.log(player.control) // 有值
      console.log(player.contextmenu) // 
    })
  }
}
```

## 弹幕插件

NPlayer 的弹幕功能就是由插件形式编写。如果你想给播放器添加弹幕功能，可以直接引入 NPlayer 的弹幕插件。

```js
import Player from 'nplayer'
import Danmaku from '@nplayer/danmaku'

new Player(plugins: [new Danmaku()])
```

更多插件详情可以查看弹幕插件章节。
