---
title: 插件
---

NPlayer 可以通过插件来扩充它的功能，编写一个插件也非常的简单。

NPlayer 的插件是一个对象，它的接口定义如下。

```typescript
interface Plugin {
  apply: (player: Player) => void;
  dispose?: () => void;
}
```

插件其实就是一个接收 `player` 对象的一个函数。其中 `dispose` 可选的卸载方法，当播放器卸载时会调用该方法。应用插件时播放器会调用 `apply` 方法并传入 `player` 对象作为参数。

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

在执行插件 `apply` 的时候，`player` 对象的 `control` 和 `contextmenu` 还没初始化，都是 `undefined`。（player 上的其他对象都已初始化完成）

```js
{
  apply(player) {
    console.log(player.control) // undefined
    console.log(player.contextmenu) // undefined

    player.on('AfterInit', () => {
      console.log(player.control) // 有值
      console.log(player.contextmenu) // 有值
    })
  }
}
```

所以在插件中，可以修改 `player.opts` 的 `controls`、`settings` 和 `contextMenus` 的值，从而影响最终的渲染结果。

```js
{
  apply(player) {
    player.opts.controls = player.opts.controls.filter(c => c.id !== 'volume')
  }
}
```

上面代码将去除音量控制。

## 插件参数

插件可以是类或函数的方式，这方便接收插件参数。

```js
function createMyPlugin(opts) {
  return {
    apply(player) {
      console.log(opts)
    }
  }
}

class MyPlugin {
  constructor(opts) {
    this.opts = opts
  }
  
  apply(player) {
    console.log(this.opts)
  }
}

new Player({
  plugins: [createMyPlugin({ // 参数 }), new MyPlugin({ // 参数 })]
})
```

## 内置组件

开发插件的时候还可以使用 NPlayer 的内置组件来加速开发。

```js
{
  apply(player) {
    const { components } = player.Player
  }
}
```

请查看 [内置插件](api/components.md)。

## 主题

如果插件包含 UI 的话，可以使用 CSS 变量来统一主题。

```css
.nplayer_my_plugin {
  color: var(--theme-color);
}
```

插件的 CSS 应该使用 `.nplayer_` 作为开头，统一命名，更多 CSS 变量可以查看 [定制主题](theme.md)。

## 弹幕插件

NPlayer 的弹幕功能就是由插件形式编写。如果你想给播放器添加弹幕功能，可以直接引入 NPlayer 的弹幕插件。

```js
import Player from 'nplayer'
import Danmaku from '@nplayer/danmaku'

new Player(plugins: [new Danmaku()])
```

更多插件详情可以查看 [弹幕插件章节](ecosystem/danmaku.md)。
