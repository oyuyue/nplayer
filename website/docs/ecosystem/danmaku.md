---
title: 弹幕插件
---

[![npm version](https://img.shields.io/npm/v/nplayer?logo=npm)](https://github.com/woopen/nplayer) 
[![gzip size](https://badge-size.herokuapp.com/woopen/nplayer/main/packages/nplayer-danmaku/dist/index.min.js?compression=gzip)](https:/unpkg.com/@nplayer/danmaku/dist/index.min.js) 
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/08e3f1086b5748aaa745ca655ecd1c6a)](https://www.codacy.com/gh/woopen/nplayer/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=woopen/nplayer&amp;utm_campaign=Badge_Grade) 
[![Test](https://github.com/woopen/nplayer/actions/workflows/test.yml/badge.svg?branch=main)](https://github.com/woopen/nplayer/actions/workflows/test.yml) 

该插件可以给 NPlayer 添加弹幕功能。它可以保持大量弹幕而不卡顿，它支持非常多的设置，弹幕防碰撞、弹幕速度、字体、速度、透明度、显示区域等。

![nplayer danmaku](/img/preview.jpg)

## 安装

执行下面命令使用 npm 包的形式安装。

```bash
npm i -S @nplayer/danmaku
```

或者使用 CDN 的方式。

```html
<script src="https://unpkg.com/@nplayer/danmaku@latest/dist/index.min.js"></script>
```

:::caution

与 NPlayer 不同，在使用 CDN 方式引入的时候，直接用 `NPlayerDanmaku` 即可。

:::

## 快速上手

```js
import Player from 'nplayer'
import Danmaku from '@nplayer/danmaku'

const danmakuOptions = {
  items: [
    { time: 1, text: '弹幕～' }
  ]
}

const player = new Player({
  plugins: [new Danmuku(danmakuOptions)]
})

player.mount(document.body)
```

<video src="/img/nplayer.mp4" muted autoPlay preload="auto" loop />

## 控制条

弹幕插件会注册 `danmaku-send` 和 `danmaku-settings` 这两项。默认情况会自动加入到控制条中。

通过 `autoInsert` 参数可以控制是否自动插入，自动插入逻辑是，找到 `spacer` 项，将它替换成 `danmaku-send` 和 `danmaku-settings`，**如果找不到 `spacer` 则不会插入**。

```js
new Player({
  controls: [['play', 'spacer', 'danmaku-settings'], ['progress']],
  plugins: [
    new Danmaku({
      autoInsert: false,
    })
  ]
})
```

你可以将 `autoInsert` 设置为 `false`，然后手动设置控制条项，如上代码，手动加入了弹幕设置项，移除了弹幕发送项。

## 弹幕对象

弹幕插件还会在 player 对象上注册一个 `danmaku` 对象。你可以通过 `player.danmaku` 访问该对象。

```js
console.log(player.danmaku)
```

## 弹幕列表

弹幕列表可以通过 `items` 参数传入，一个弹幕对象签名如下。

```typescript
interface BulletOption {
  color?: string; // 弹幕颜色
  text: string; // 弹幕文字
  time: number; // 弹幕出现时间
  type?: 'top' | 'bottom' | 'scroll'; // 弹幕类型，默认为滚动类型
  isMe?: boolean; // 是否是当前用户发送的
  force?: boolean; // 是否强制展示该弹幕（弹幕较多，并且是防碰撞模式时，可能会丢弃一部分弹幕）
}
```

弹幕列表必须按照 `time` 从小到大排序。如果获取的弹幕是无序的，那么在传入之前需要自己 `.sort((a, b) => a.time - b.time)` 一下。

你还可以通过 `danmaku` 对象的 `appendItems` 和 `resetItems` 等方法，添加和重置弹幕，请查看下方对应描述。

## 弹幕事件

弹幕插件也会在 `player` 对象上触发一些事件，你可以使用 `player.on` 监听事件。你可以通过 `danmaku.EVENT` 对象访问相关事件名，或直接使用字符串。

```js
player.on('DanmakuSend', (opts) => {
  console.log(opts)
})
player.on(player.danmaku.DANMAKU_UPDATE_OPTIONS, () => {
  console.log(player.danmaku.opts)
})
```

### DANMAKU_SEND / DanmakuSend

用户发送弹幕之前触发。

### DANMAKU_UPDATE_OPTIONS / DanmakuUpdateOptions

用户更新弹幕设置后触发。

## 配置参数

配置参数是初始化弹幕插件时传入的参数。配置参数都不是必填参数。

```js
import Danmaku from '@nplayer/danmaku'

const danmakuPlugin = new Danmaku({ // 配置参数 })
```

默认参数如下：

```js
{
  autoInsert: true,
  disable: false,
  blocked: [],
  fontsize: 24,
  fontsizeScale: 1,
  opacity: 1,
  speed: 1,
  area: 0.5,
  unlimited: false,
  bottomUp: false,
  colors: ['#FE0302', '#FF7204', '#FFAA02', '#FFD302', '#FFFF00', '#A0EE00', '#00CD00', '#019899', '#4266BE', '#CC0273', '#222222', '#FFFFFF'],
  duration: 5,
  items: [],
  zIndex: 5,
  persistOptions: false,
  isDefaultColor(color: string): boolean {
    if (!color) return true;
    color = color.toLowerCase();
    return color === '#fff' || color === '#ffffff';
  },
  maxPerInsert: 20,
  poolSize: 50,
  discard() { return false; },
}
```

### `autoInsert: boolean`

是否自动插入控制条项。

### `disable: boolean`

是否禁用弹幕

### `blocked: Array<'scroll' | 'top' | 'bottom' | 'color'>`

禁用的弹幕类型数组。

### `fontsize: number`

字体大小。

### `fontsizeScale: number`

默认字体的放大比例，`0.5` 到 `1.5`。

### `opacity: number`

弹幕不透明度，`0.1` 到 `1`。

### `speed: number`

弹幕速度倍数，`0.5` 到 `1.5`。

### `area: 0.25 | 0.5 | 0.75 | 1`

弹幕显示区域。

### `unlimited: boolean`

是否开启无限弹幕模式。

### `bottomUp: boolean`

滚动类型弹幕是否从下到上。

### `colors: string[]`

发送弹幕时可选的颜色数组。

### `duration: number`

一条弹幕展示的时间。

### `items: BulletOption[]`

弹幕数组。**弹幕数组必须要按时间从小到大**。

### `zIndex: number`

弹幕的层级。

### `persistOptions: boolean`

是否持久化，用户弹幕设置。

### `isDefaultColor?: (color: string) => boolean`

用于判断是否是默认颜色，当用户屏蔽才彩色类型弹幕时，会调用该方法，把这个方法返回 `false` 的弹幕全部屏蔽。

默认只对 `#fff`、 `#ffffff` 或空返回 `true`。

### `maxPerInsert: number`

单次插入多少弹幕，默认是 `20` 个。

### `poolSize: number`

为了避免重复创建弹幕对象，弹幕内部有个弹幕池，这个参数用于设置弹幕池大小，默认为 `50`。

### `discard: (b: BulletOption) => boolean`

发送弹幕之前会调用该回调，用来判断是否丢弃当前弹幕。

## danmaku 对象

通过 `player.danmaku` 可以访问弹幕对象。

### 属性

#### `el: HTMLElement`

弹幕容器 DOM 元素。

#### `opts: DanmakuOptions`

弹幕参数。

#### `enabled: boolean`

是否启用。

#### `paused: boolean`

是否暂停。

#### `fontsize: number`

最终字体大小，`fontsize * fontsizeScale`。

#### `speedScale: number`

最终弹幕速度倍速，`playbackRate * speed`。

#### EVENT

弹幕插件触发事件对象。

### 方法

#### `send(opts: BulletOption): void`

发送一个弹幕。

#### `pause()`

暂停弹幕。

#### `resume()`

恢复弹幕。

#### `getItems(): BulletOption[]`

获取弹幕列表。

#### `addItem(opts: BulletOption): number`

添加一个弹幕到弹幕列表，并返回该弹幕插入下标。（大量弹幕请不要循环调用该方法，请使用其他批量方法）

#### `appendItems(items: BulletOption[]): void`

在现有弹幕列表末尾添加弹幕列表。**需要保证添加的弹幕列表是有序的，而且其第一个弹幕的时间比现有的最后一个时间大**。

#### `resetItems(items: BulletOption[]): void`

重置弹幕列表。如果你又有一堆无序弹幕列表需要加入。可以通过 `getItems()` 获取现有弹幕，然后拼接两个列表，做排序，再调用该方法。

```js
const oldItems = player.danmaku.getItems()
const newUnsortItems = []
const sortedItems = oldItems.concat(newUnsortItems).sort((a, b) => a.time - b.time)
player.danmaku.resetItems(sortedItems)
```

#### `clearScreen()`

清屏。

#### `enable()`

启用。

#### `disable()`

禁用。
