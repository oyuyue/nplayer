---
title: 快速开始
slug: /
---

[![npm version](https://img.shields.io/npm/v/nplayer?logo=npm)](https://github.com/woopen/nplayer) 
[![gzip size](https://badge-size.herokuapp.com/woopen/nplayer/main/packages/nplayer/dist/index.min.js?compression=gzip)](https:/unpkg.com/nplayer/dist/index.min.js) 
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/08e3f1086b5748aaa745ca655ecd1c6a)](https://www.codacy.com/gh/woopen/nplayer/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=woopen/nplayer&amp;utm_campaign=Badge_Grade) 
[![Test](https://github.com/woopen/nplayer/actions/workflows/test.yml/badge.svg?branch=main)](https://github.com/woopen/nplayer/actions/workflows/test.yml) 

## 介绍

NPlayer 是由 Typescript 加 Sass 编写，无任何第三方运行时依赖，[兼容 IE11](ie11.md)，支持移动端、支持 SSR、支持直播。高度可定制，所有图标、主题色等都可以替换，并且提供了[内置组件](api/components.md)方便二次开发。你可以自定义任意多个断点，不仅仅是兼容移动端，只要愿意，你可以非常轻松的兼容手机竖屏、手机横屏、平板等设备。它还拥有插件系统，[弹幕功能](ecosystem/danmaku.md)就是使用插件形式提供，使用时按需引入即可。该播放器还可以接入任何[流媒体](streaming.md)，如 hls、dash 和 flv 等。

![NPlayer](/img/preview.jpg)

<video src="/img/nplayer.mp4" muted autoPlay preload="auto" loop />

## 安装

```bash
npm i -S nplayer
```

详细内容请查看[安装章节](installation.md)。

## 开始使用

```js
import Player from 'nplayer'

const player = new NPlayer({
  src: 'https://v-cdn.zjol.com.cn/280443.mp4'
})

// player.mount('#app') 还可以通过选择字符串自动找到相应的 DOM 元素
player.mount(document.body)
```

首先我们导入 `Player`，然后创建一个播放器实例，并传入视频的地址，然后调用 `mount` 方法将它挂载到 `body` 元素中。

```js
import Player from 'nplayer'

const video = document.createElement('video')
video.src = 'https://v-cdn.zjol.com.cn/280443.mp4'
const player = new Player({ video, videoProps: { autoplay: 'true' } })

player.mount(document.body)
```

我们还可以通过 `video` 参数，自己提供 `video` 元素，而不是让 `NPlayer` 自己创建。还可以通过 `videoProps` 给 `video` 元素设置属性。更多参数请查看[参数章节](api/config.md) 

`mount` 方法可以将播放器挂载到指定 DOM 元素中，它接收一个参数，可以是一个字符串或一个 DOM 元素。当是字符串时，将会自动查找相应的 DOM 元素。

## Video Source

除了设置 video 元素的 `src` 参数，还可以添加 [Source DOM 元素](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/source)。

```js
new Player({ video, videoSources: [{ src: 'video.webm', type: 'video/webm' }] })
```

最终生成 DOM 结构如下。

```html
<video class="nplayer_video" crossorigin="anonymous" preload="auto" playsinline="true">
  <source src="video.webm" type="video/webm">
</video>
```

其中 `crossorigin`、`preload` 和 `playsinline` 是默认的 `videoProps`。

一个 Source 参数签名如下。

```typescript
interface VideoSource {
  media?: string;
  sizes?: string;
  src?: string;
  srcset?: string;
  type?: string;
}
```

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

自定义插件中只能访问到 Player 实例，这时你就可以通过 `Player` 属性访问静态属性。具体属性，请参考[属性章节](api/attrs.md)。

Player 实例上有很多属性和方法，比如 `player.fullscreen` 是 `Fullscreen` 对象，通过它你可以手动进入和退出全屏，`player.playing` 属性来判断当前时候在播放等等。

你可以通过查看[API 部分](api/attrs.md) 了解全部属性和方法。

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

详情请查看[事件章节](api/events.md)。

## 播放器尺寸变化

默认情况下当浏览器尺寸变化或者播放器容器尺寸变化时，播放器及其内部组件会自动调节自身尺寸。

你可以通过 `player` 对象上的 `rect` 属性获取播放器的宽高和坐标（内部是使用 `getBoundingClientRect` API）。

```js
import Player from 'player'

const player = new Player()
console.log(player.rect.width)
console.log(player.rect.height)
console.log(player.rect.x)
console.log(player.rect.y)
```

你可以监听 `UpdateSize` 事件来响应播放器尺寸变化。

:::caution

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

## 响应式布局

NPlayer 一共有三个控制条，底部两个，顶部一个。

![NPlayer control](/img/control.jpg)

为了看清 3 个控制条，这里再给每个控制条加了个背景色，默认是没有的。

```js
new Player({
  controls: [
    ['play', 'volume', 'time', 'spacer', 'web-fullscreen', 'fullscreen'],
    ['progress'],
    ['spacer', 'settings']
  ]
}).mount(document.body)
```

这个布局是通过 `controls` 参数配置的。它是一个二维数组，下标 `0` 和 `1` 是下方的两个控制条，`2` 是顶部的控制条。

详情请查看[控制条章节](control.md)。

NPlayer 还提供了两套交互，触屏交互和键鼠交互，详情请查看[响应式/多设备章节](responsive.md)。

## 更新配置

NPlayer 几乎所有部分都可以配置。

- 配置主题，请参考 [主题章节](theme.md)。
- 添加、移除控制条项目或改变顺序，请参考 [控制条章节](control.md)。
- 添加、移除控制条设置项目或改变顺序，请参考 [设置菜单章节](settings.md)。
- 添加、移除右键菜单项目或改变顺序，请参考 [右键章节](contextmenu.md)。
- 更多请直接的点击侧边栏对应章节。

当你实例一个 `player` 对象后，想修改它的配置，可以使用 `updateOptions(新的配置)` 方法。

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

如果你想更新控制条，可以使用 `updateControlItems` 方法。详情请查看[控制条章节](control.md)。

```js
player.updateControlItems(['spacer', 'settings'], 2)
```

## Toast

如果你想给弹出一个提示时，可以使用 `player.toast`。

```js
const player = new Player()
player.toast.show('提示~', 'left-top', 1000)
```

在播放器左上方弹出一个显示 1 秒的提示。Toast 详情请查看 API 部分文档。

## 内置组件

Player 提供了一些内置组件来方便二次开发和统一交互。比如控制条项目的 `Tooltip` 组件，进度条 `Slider` 组件，`Checkout` 选择框组件等等。

请查看[内置组件章节](api/components.md) 了解更多。

## 问题 & 新功能

如果你遇到 BUG 或者是想要新功能，欢迎提交 [issue](https://github.com/woopen/nplayer/issues/new/choose)。

## 推荐文章

- [NPlayer 支持任何流媒体和 B 站弹幕体验的视频播放器](https://juejin.cn/post/6953803485636722702)
- [从零开发弹幕视频播放器1](https://juejin.cn/post/6953429334937829384)
- [流媒体视频基础 MSE 入门 & FFmpeg 制作视频预览缩略图和 fmp4](https://juejin.cn/post/6953777965838630926)
- [原来爱优腾等视频网站都是用这个来播放流媒体的](https://juejin.cn/post/6954761121727250439)
- [如何保护会员或付费视频？优酷是怎么做的？ - HLS 流媒体加密](https://juejin.cn/post/6955287754670342174)
