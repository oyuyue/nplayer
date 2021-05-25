---
title: 控制条
---

控制条指的是播放器下方的控制项的集合，它包含播放、暂停、音量调节等按钮。NPlayer 一共有 3 个控制条，底部两个，顶部一个。

<video src="/img/nplayer.mp4" muted autoPlay preload="auto" loop></video>

## 配置

可以通过 `controls` 参数来配置控制条组件的位置，显示隐藏等，它是一个二维数组，顺序是从下到上，一共三个。

默认参数如下。

```js
new NPlayer({
  controls:  [
    ['play', 'volume', 'time', 'spacer', 'airplay', 'settings', 'web-fullscreen', 'fullscreen'],
    ['progress']
  ]
})
```

每个控制项都有一个 `id`，通过它可以配置控制项的位置。

其中比较特别的是 `spacer` 控制项，可以将控制条分为两部分。比如想把播放按钮放到右侧，只需将 `play` 字符串放到 `spacer` 右侧即可。

## 内置控制项

| 控制项 ID | 描述 |
| --- | --- |
| play | 播放暂停 |
| volume | 音量调节 |
| time | 视频时间 |
| airplay | 隔空播放（只有当前环境支持，才会显示出来） |
| web-fullscreen | 网页全屏 |
| fullscreen | 全屏 |
| progress | 视频进度条 |
| spacer | 用来分离控制项，将控制项分成两半 |

## 自定义控制项

可以添加自己的控制项。控制项的签名如下。

```typescript
interface ControlItem {
  el: HTMLElement; // 控制项的 DOM 元素
  id?: string; // 一般只有在自定义插件中才会设置
  tip?: string; // 提示字符串
  tooltip?: Tooltip; // 提示组件对象
  mounted?: boolean; // 是否已经初始化，内部使用字段
  init?: (player: Player, position: number, tooltip: Tooltip) => void; // 初始化时会调用
  update?: (position: number) => void; // 挂载时，如果 `mounted` 等于 `true`，则会调用
  hide?: () => void; // 隐藏时会调用
  isSupport?: (player: Player) => boolean; // 是否支持
  dispose?: () => void; // 调用将销毁该项目
  [key: string]: any;
}
```

1. 播放器初始化时，会调用 `isSupport` 判断当前是否支持该控制项，如果不支持则会中断丢弃，处理下一个。
2. 接下来会执行 `init` 方法，并传入两个参数，最后会将 `el` 添加到控制条中。

`tip` 参数是一个字符串，用户鼠标放到对应控制项上时会显示这个提示字符串。如果想自己控制这个提示字符串时，可以接收在 `init` 方法中的第 3 个参数。

```js
const MyControl = {
  init(player, position, tooltip) {
    this.tooltip = tooltip // 按照约定需要设置到自己 tooltip 属性上
  }
}

new Player({
  controls:  ['play', 'volume', 'time', 'spacer', MyControl, 'airplay', 'settings', 'web-fullscreen', 'fullscreen']
})
```

如果需要使用 `tooltip` 参数时，按照约定需要将这个 `tooltip` 设置到自己 `tooltip` 属性上，不需要时可以不用设置。 

:::info

Tooltip 是内置组件，Tooltip 的使用方法请查看 [内置组件](api/components.md)

:::

如果不需要 `tooltip` 时，可以不接收第 3 参数。

```js
const myControl = {
  tip: '提示~',
  init(player) {
    console.log(player)
  }
}
```

## 多控制条

NPlayer 一共有 3 个控制条，底部两个，顶部一个。`controls` 参数是一个二维数组，顺序是从下到上。

```js
new Player({
  controls: [
    ['play', 'progress', 'time', 'web-fullscreen', 'fullscreen'],
    [],
    ['spacer', 'settings'],
  ]
}).mount(document.body)
```

上方把第 2 个控制条中的 `progress`，放入第一个中，并将 `settings` 放入第 3 个（顶部）中。

![NPlayer Control](/img/phone.png)

为了看清 3 个控制条，这里再给每个控制条加个背景色。（默认控制条是没有背景色的）

![NPlayer control](/img/control.jpg)

## 动态更新控制项

你可以使用 `updateControls()` 方法来动态更新控制条项。

```js
const player = new Player().mount(document.body)

player.updateControlItems(['spacer', 'settings'], 2)
```

第一个参数是新的控制条数组，第二个参数是控制条的位置，这里的 `2` （数组下标从 0 开始）就是第 3 个控制条，默认是 `0` 也就是最下面的控制条。

:::caution

控制项是单例的，也就是整个布局中每个控制项只能出现一次。比如上方将底部控制条的 `settings` 放入顶部控制条，最终不会有两个 `settings` 控制项，而是 `settings` 从底部控制台移动到了顶部控制条。

其中比较特殊的是 `spacer`，它可以同时在多个控制条中，但是每个控制条中最多只能有一个 `spacer`。

:::

当然你可以通过 `bpControls` 参数来设置断点布局，而不是手动调用 `updateControlItems`。详情请查看[响应式布局](responsive.md)。

## 注册和获取控制项

你可以使用 `player.registerControlItem(item: ControlItem, id?: string): void` 注册一个控制项，一般只会在插件中使用，详情请查看[插件](plugin.md)。

`player.getControlItem(id: string): ControlItem | null` 可以获取对应对象。

```js
const player = new Player()

const play = player.getControlItem('play')
if (play) {
  console.log(play)
}
```

上面获取内置 `play` 控制项。

:::caution

其中 `spacer` 控制项比较特殊，通过 `getControlItem('spacer')` 并不能获取到它的实例。

:::

## 例子

- [清晰度切换](examples/quantity-switch.md)
