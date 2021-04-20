---
title: 快速开始
slug: /
---

## 介绍

NPlayer 是由 Typescript 加 Sass 编写，无任何第三方运行时依赖，兼容 IE11，支持 SSR。该播放器高度可定制，提供了内置组件方便二次开发。并且有用插件系统，其弹幕功能就是使用插件形式提供。该播放器可以接入任何流媒体，如 hls、dash 和 flv 等。

## 安装

使用如下命令快速安装 NPlayer。

```bash
npm i -S nplayer
```

更多请查看 [安装章节](installation.md)。

## 开始使用

```js
import Player from 'nplayer'

const player = new NPlayer({
  videoAttrs: { src: 'VIDEO SRC' }
})

// player.mount('#app')
player.mount(document.body)
```

上面是创建一个播放器最简单的方法，创建一个 `player` 对象，然后将它挂载到 `document.body` 中。

其中 `videoAttrs` 参数会直接传给 `video` 元素，我们这里制定了 `video` 元素的 `src` 属性。

也可以自己提供 `video` 元素。

```js
import Player from 'nplayer'

const video = document.createElement('video')
video.src = 'VIDEO SRC'
const player = new Player({ video, videoAttrs: { autoplay: 'true' } })

player.mount(document.body)
```

在自己提供 `video` 元素的时候，依旧可以使用 `videoAttrs` 参数，将属性添加到这个 `video` 元素上。

`player.mount` 方法可以将播放器挂载到页面上，它接收一个参数，可以是一个字符串或一个 dom 元素。当是字符串时，将会自动查找该 dom 元素。

## 属性和方法

Player 上有很多方式访问到自己。

```js
import Player from 'nplayer'

const player =  new Player()
console.log(player.Player === Player) // true
console.log(Player.Player === Player) // true
```

Player 有 `Player` 静态属性可以访问到自己。并且 Player 的实例的原型上也有 `Player` 属性可以访问自身。`Player` 上有很多静态属性，如果你只访问得到 Player 实例时，你也可以通过 `Player` 属性访问这些静态属性。

```js
const Plugin = {
  apply(player) {
    console.log(player.Player.components) 
    console.log(player.Player.EVENT)
    console.log(player.EVENT) // EVENT 也在原型上
    // ...
  }
}
```

自定义插件中只能访问到 Player 实例，这时你就可以通过 `Player` 属性访问静态属性。具体属性，请参考 [属性章节](api/attrs.md)。

Player 实例上有很多属性和方法，比如 `player.fullscreen` 是 `Fullscreen` 对象，通过它你可以手动进入和退出全屏，`player.playing` 属性来判断当前时候在播放等等。

你可以通过查看 [API 部分](api/attrs.md) 了解全部属性和方法。

## 事件

`player` 对象有下面 5 个事件相关的方法。

| 方法 | 描述 |
| --- | --- |
| on(evt: string, fn: Function) | 监听事件 |
| once(event: string, fn: Function) | 监听事件，但是只调用一次回调函数 |
| emit(evt: string, ...args: any[]) | 触发事件 |
| off(evt: string, fn?: Function) | 解除事件监听 |
| removeAllListeners(evt?: string) | 移除所有事件监听 |

你可以使用这些方法监听内置事件或触发自定义事件。

NPlayer 事件名是大驼峰形式的字符串。

```js
import Player, { EVENT } form 'nplayer'

const player = new Player()

console.log(EVENT.CONTROL_SHOW)
console.log(Player.EVENT.CONTROL_SHOW)
console.log(player.EVENT.CONTROL_SHOW)
console.log('ControlShow')
```

上面打印都是相同的字符串。

详情请查看 [事件章节](api/events.md)。

## 播放器尺寸变化

默认情况下当浏览器尺寸变化或者播放器容器尺寸变化时，播放器及其内部组件会自动调节自身尺寸。

你可以通过 player 对象上的 `rect` 属性获取播放器的宽高和坐标（内部是使用的 `getBoundingClientRect` api）。

```js
import Player from 'player'
const player = new Player()
console.log(player.rect.width)
console.log(player.rect.height)
console.log(player.rect.x)
console.log(player.rect.y)
```

你可以监听 `UpdateSize` 事件来进行相关操作，防止自己添加的组件由于用了老的数据，而导致变形或者位置出错。

```js
const Plugin = {
  apply(player) {
    player.on('UpdateSize', () => this.updatePositionAndSize())
  }
}
```

:::caution 注意

NPlayer 监听自身尺寸变化使用了 `ResizeObserver` api。如果你的目标浏览器不支持 `ResizeObserver`。当时播放器尺寸变化时，请手动触发 `UpdateSize`，`player.emit('UpdateSize')` 或者在 NPlayer 之前引入 `ResizeObserver` 的 polyfill。

:::

## 销毁

`player` 及其中组件都实现了 `Disposable` 接口，也就是拥有 `dispose` 方法，调用该方法将会销毁该对象。

```js
const player = new Player()
player.mount(document.body)
setTimeout(() => player.dispose(), 3000)
// 3 秒后销毁 player
```

## 多层级

NPlayer 由 6 个不同功能的层级组成，每个层级有自己的 `z-index`。

| 层级 | z-indx | 描述 |
| --- | --- | --- |
| video 视频元素 | - | 视频元素没有设置 z-index |
| control 控制条 | 10 | 视频底部控制条 |
| poster 海报 | 20 | 视频海报 |
| loading 加载中 | 30 | 视频加载时出现的加载中元素 |
| contextmenu 右键菜单 | 40 | NPlayer 右键菜单 |
| toast 提示框 | 50 | 提示框 |

`z-index` 高的组件会覆盖低的组件。当要实现自己组件时可以参考上表中的 `z-index`，将它放入合适层级。如，弹幕插件默认层级 `z-index` 是 5，那它将出现在 control 下方，video 元素上方。

## 更新配置

NPlayer 几乎所有部分都可以配置。

- 配置主题，请参考 [主题章节](theme.md)。
- 添加、移除控制条项目或改变顺序，请参考 [控制条章节](control.md)。
- 添加、移除控制条设置项目或改变顺序，请参考 [设置菜单章节](settings.md)。
- 添加、移除右键菜单项目或改变顺序，请参考 [右键章节](contextmenu.md)。
- 更多请直接的点击侧边栏对应章节。

当你实例一个 player 对象后，想修改它的配置，可以使用 `updateOptions(新的配置)` 方法。

```js
player.updateOptions({
  poster: 'new_url',
  thumbnail: {
    images: ['new_url']
  }
})
```

上面这个例子是使用它来更新海报和预览缩略图。

你还可以监听 `UpdateOptions` 事件来做出变更，如，在自定义插件中可以这样。

```js
const Plugin = {
  apply(player) {
    player.on('UpdateOptions', () => this.update(player.opts))
  }
}
```

但并不是所有配置项都会做出对应修改，`settings`、`contextMenus` 和 `controls` 变化并不会做出对应修改。

如果你想隐藏控制条项目时，调用 `player.updateOptions({ control: ['play', 'fullscreen'] })`，将控制条只保留播放和全屏按钮。会没有任何效果，控制条项目还是和之前一样。

但是你可以使用如下方法隐藏一个菜单项。

```js
player.getControlItem('play').element.style.display = 'none'
```

对于右键菜单和设置菜单都是差不多的操作，详情请查看对应章节。

## Toast

如果你想给弹出一个提示时，可以使用 `player.toast`。

```js
const player = new Player()
player.toast.show('提示~', 'left-top', 1000)
```

在播放器左上方弹出一个显示 1 秒的提示。Toast 详情请查看 API 部分文档。

## 内置组件

Player 提供了一些内置组件来方便二次开发和统一交互。比如控制条项目的 `Tooltip` 组件，进度条 `Slider` 组件，`Checkout` 选择框组件等等。

请查看 [内置组件章节](api/components.md) 了解更多。

## 贡献

如果你遇到 BUG 或者是想要新功能，可以到 [GitHub issues](https://github.com/woopen/nplayer/issues/new/choose) 中创建一个新 issue。

如果想提交 PR，请查看 [贡献](https://github.com/woopen/nplayer/blob/main/CONTRIBUTING.md) 了解代码结构等信息。

## 更多
