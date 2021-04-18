---
title: 定制主题
---

NPlayer 所有的 icon、主题色、进度条等都可以替换。可以从两个方向来配置主题，分为 Player 构造函数参数、方法和 CSS 变量。

## 内置 icon

修改内置 icon 可以通过 NPlayer 的 Icon 对象修改。

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

Icon 对象提供一个 `register` 方法，它接收两个参数，icon 名和一个接收 `class` 参数并返回一个 HTML 元素的函数，它可以用来添加或替换已有的 icon。

当注册成功后就可以通过，`Icon['注册的 icon 名']` 访问这个函数了。

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

你可以通过覆盖上面 icon 名，从而修改播放器对应 icon。

:::caution 注意

需要在构造 player 对象之前替换 icon，否则 player 对象构造出来后还是使用的老 icon。

:::

## 主题色

NPlayer 可以使用构造参数和 CSS 变量修改颜色。

可以通过 3 个构造参数修改不同颜色。

| 参数名 | 描述 |
| --- | --- |
| themeColor | 主题色 |
| progressColor | 播放进度条颜色 |
| volumeProgressColor | 音量条颜色 |
| posterColor | 海报背景色，默认是透明色 |

还可以通过 CSS 变量修改这些颜色，与之对应的 CSS 变量分别如下：

```css
--theme-color: #007aff;
--progress-color: #007aff;
--volume-progress-color: #007aff;
--poster-bg-color: transparent;
```

## loading

可以通过 `loadingElement` 参数修改播放器加载中的元素，它是一个 HTML 元素。

```js
const loading = new Image()
loading.src = 'loading.gif'

new Player({ loadingElement: loading })
```

## 海报播放按钮

可以通过 `posterPlayElement` 参数修改播放器海报真中间的播放按钮，它是一个 HTML 元素。

## 音量进度条宽度

音量按钮的宽度可以通过 `volumeBarWidth` 修改，它是一个 `number` 或 `string` 类型。默认是 `100px`。
