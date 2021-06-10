---
title: 定制主题
---

NPlayer 所有的图标、按钮都可以替换。

![nplayer bilibili](/img/custom.jpg)

## 内置图标

修改内置图标可以通过 NPlayer 的 Icon 对象修改。

```js
import Player, { Icon } from 'nplayer'

console.log(Player.Icon === Icon)
// true

Icon.register('play', (cls) => {
  const i = document.createElement('i')
  i.classList.add('icon_play')
  if (cls) i.classList.add(cls)
  return i;
})

console.log(Icon.play('cls_name'))
// <i class="icon_play cls_name"></i>

const player = new Player()
player.mount(document.body)
```

Icon 对象提供一个 `register` 方法，它接收两个参数，图标名和一个接收类名参数并返回 DOM 元素的函数，它可以用来添加或替换已有的图标。

当注册成功后就可以通过，`Icon['图标名']` 访问这个函数了。

目前 NPlayer 一共内置有如下 icon。

| icon 名 | 描述 |
| --- | --- |
| play | 播放 |
| pause | 暂停 |
| volume | 音量 |
| muted | 静音 |
| cog | 设置 |
| webEnterFullscreen | web 全屏 |
| webExitFullscreen | web 退出全屏 |
| enterFullscreen | 全屏 |
| exitFullscreen | 退出全屏 |
| airplay | 隔空播放 |

你可以通过覆盖上面图标名，从而修改播放器对应图标。

:::caution

需要在构造 player 对象之前替换 icon，否则 player 对象构造出来后还是使用的老 icon。

:::

## 主题色

可以使用构造参数和 CSS 变量修改颜色。

下面是构造函数参数。

| 参数名 | 描述 |
| --- | --- |
| themeColor | 主题色 |
| progressBg | 播放进度条背景 |
| volumeProgressBg | 音量条背景 |
| posterBgColor | 海报背景色，默认是透明色 |

与之对应的 CSS 变量如下：

```css
--theme-color: #007aff;
--poster-bg-color: transparent;
--progress-bg: #007aff;
--volume-progress-bg: #007aff;
```

## 进度条锚点

通过 `progressDot` 参数修改播放器进度条上的拖动点，它是一个 DOM 元素。

```js
new Player({ progressDot: document.createElement('div') })
```

## loading

可以通过 `loadingEl` 参数修改播放器加载中的元素，它是一个 DOM 元素。

```js
const loading = new Image()
loading.src = 'loading.gif'

new Player({ loadingEl: loading })
```

## 海报播放按钮

可以通过 `posterPlayEl` 参数修改播放器海报真中间的播放按钮，它是一个 DOM 元素。

## 音量进度条宽度

音量按钮的宽度可以通过 `volumeBarLength` 修改，它是一个 `number` 或 `string` 类型。默认是 `100px`。

## 垂直音量进度条

如果将 `volumeVertical` 设置为 `true`，音量控制条将是垂直的，而不是横向的。

## 例子

- [自定义 Bilibili 主题](examples/bilibili-theme.md)
