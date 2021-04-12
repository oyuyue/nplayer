---
title: 快速开始
slug: /
---

## 介绍

NPlayer 是由 Typescript 编写的视频播放器，它没有任何任何第三方框架依赖。

## 安装

可以使用如下命令快速安装 NPlayer。

```bash
npm i -S nplayer
```

更多安装方式，请查看 [安装章节](installation.md)。

## 开始使用

安装好就可以开始使用了。

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
const player = new NPlayer({ video, videoAttrs: { autoplay: 'true' } })

player.mount(document.body)
```

在自己提供 `video` 元素的时候，依旧可以使用 `videoAttrs` 参数，将属性添加到这个 `video` 元素上。

`player.mount` 方法可以将播放器挂载到页面上，它接收一个参数，可以是一个字符串或一个 dom 元素。当是字符串时，将会自动查找该 dom 元素。

## 通过 CDN 的方式

还可以通过 CDN 来使用。

```html
<script src=""></script>
```

NPlayer 包是 umd 格式，所以在没使用 amd 或 commonjs 的时候，可以通过 `window.NPlayer` 访问到。

```js
const player = new RNlayer.Player({ videoAttrs: { src: 'VIDEO SRC' }})
player.mount(document.body)
```

需要注意，在通过 CDN 的方式使用时，Player 类是 NPlayer 对象的 `Player` 属性。
