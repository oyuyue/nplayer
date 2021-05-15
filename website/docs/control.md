---
title: 控制条
---

控制条指的是播放器下方的控制组件集合，它包含播放、暂停、音量调节等按钮。NPlayer 一共有 3 个控制条，底部两个，顶部一个。

## 配置

可以通过 `controls` 参数来配置控制条组件的位置，显示隐藏等，它是一个二维数组，顺序是从下到上，一共三个。

它的默认参数如下。

```js
{
  controls:  [
    ['play', 'volume', 'time', 'spacer', 'airplay', 'settings', 'web-fullscreen', 'fullscreen'],
    ['progress']
  ]
}
```

每个控制条组件都有一个 `id`，通过它可以配置控制条的顺序，让组件根据顺序从左到右排序。也可以去除其中某一项移除该功能，比如去掉 `volume`，会使控制条移除音量控制组件，让播放器无法调节音量。

其中比较特别的是 `spacer` 组件，可以将控制条分为左半区和右半区。在它左边的组件将在控制条左边，右边的组件将在右边。想把播放按钮放到右侧，只需将 `play` 字符串放到 `spacer` 右侧即可。

## 自定义控制组件

除了使用内置控制项，还可以添加自己的控制项。控制项是符合下方这个签名的对象。

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

播放器初始化时，会调用 `isSupport` 判断当前是否支持该控制项，如果不支持则会中断，处理下一个。接下来会执行 `init` 方法，并传入两个参数，最后会将 `el` 添加到控制条中。

`tip` 参数是一个字符串，用户鼠标放到对应控制项上时会显示这个提示字符串。如果想自己控制这个提示字符串时，可以接收在 `init` 方法中的第 3 个参数。

```js
const MyControl = {
  init(player, tooltip) {
    this.tooltip = tooltip // 按照约定需要设置到自己 tooltip 属性上
  }
}

new Player({
  controls:  ['play', 'volume', 'time', 'spacer', MyControl, 'airplay', 'settings', 'web-fullscreen', 'fullscreen']
})
```

如果你需要使用 `tooltip` 参数时，按照约定需要将将这个 `tooltip` 设置到自己 `tooltip` 属性上。不需要时可以不用设置。 

:::info

Tooltip 是内置组件，Tooltip 的使用方法请查看 [内置组件章节](api/components.md)

:::

如果你不需要控制 `tooltip` 时，可以不接收第 3 参数。

```js
const myControl = {
  tip: '提示~',
  init(player) {
    console.log(player)
  }
}
```

## 多控制条

NPlayer 一共有 3 个控制条，底部两个，顶部一个。，你可以将任何一个控制项放入，这 3 个控制条中的任何一个位置。`controls` 参数是一个二维数组，顺序是从下到上。

你可以任意组合这些控制项。

```js
new Player({
  controls: [
    ['play', 'progress', 'time', 'web-fullscreen', 'fullscreen'],
    [],
    ['spacer', 'settings'],
  ]
}).mount(document.body)
```

上方把第 2 个控制条中的 `progress`，放入第一个中，并将设置放入第 3 个（顶部）中，效果如下图。

![NPlayer Control](/img/phone.png)

为了看清 3 个控制条，这里再给每个控制条加个背景色。

![NPlayer control](/img/control.jpg)

## 动态更新控制项

你可以使用 `updateControls()` 方法来动态更新控制条项。

```js
const player = new Player().mount(document.body)

player.updateControlItems(['spacer', 'settings'], 2)
```

第 1 个参数是控制条数组，第 2 参数是控制条的位置，这里的 `2` （数组下标从 0 开始）就是第 3 个也就是顶部控制条，第二个参数默认是 `0` 也就是最下面的控制条。

## 注册和获取控制项

你可以使用 `player.registerControlItem(item: ControlItem, id?: string): void` 注册一个控制项，一般只会在插件中使用，详情请查看 [插件章节](plugin.md)。

`player.getControlItem(id: string): ControlItem | null` 可以获取对应对象。

```js
const player = new Player()

const spacer = player.getControlItem('spacer')
if (spacer) {
  console.log(spacer)
  spacer.flex(0)
}
```

上面获取内置 `spacer` 控制项，并使用它的 `flex` 方法将 `flex` 设置为 `0`（`flex` 方法是 `spacer` 特有的方法）。你也可以通过 `spacer.element.style.flex` 设置。

## 例子

- [清晰度切换](examples/quantity-switch.md)
